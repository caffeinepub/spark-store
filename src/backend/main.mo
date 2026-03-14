import Stripe "stripe/stripe";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Authorization "authorization/access-control";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  public type ProductCategory = {
    #tshirt;
    #hoodie;
    #accessories;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    category : ProductCategory;
    sizes : [Text];
    stock : [(Text, Nat)];
    imageId : Storage.ExternalBlob;
    featured : Bool;
    createdAt : Int;
  };

  public type CartItem = {
    productId : Text;
    size : Text;
    quantity : Nat;
  };

  public type Cart = {
    items : [CartItem];
  };

  public type OrderItem = {
    productId : Text;
    size : Text;
    quantity : Nat;
    priceCents : Nat;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Text;
    userId : Principal;
    items : [OrderItem];
    totalCents : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, Cart>();
  let orders = Map.empty<Text, Order>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  let accessControlState = Authorization.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Product management
  public query ({ caller }) func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    products.remove(productId);
  };

  // Cart management
  public query ({ caller }) func getCart(_ : ()) : async Cart {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart does not exist");
      };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    if (item.quantity == 0) {
      Runtime.trap("Quantity to add to cart must be greater than 0. Otherwise, use updateCartItemQuantity to remove item from cart.");
    };
    switch (products.get(item.productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        switch (product.stock.find(func(x) { x.0 == item.size })) {
          case (?(_, stock)) {
            if (stock < item.quantity) {
              Runtime.trap("Not enough stock for this item and size");
            };
          };
          case (_) { Runtime.trap("Size not available for this product") };
        };
      };
    };

    let existingItems = switch (carts.get(caller)) {
      case (null) { [] : [CartItem] };
      case (?cart) { cart.items };
    };

    // Check if item already exists (same product and size)
    let itemIndex = existingItems.findIndex(func(ci) { ci.productId == item.productId and ci.size == item.size });
    let items = switch (itemIndex) {
      case (null) {
        // New item, add to array
        existingItems.concat([item]);
      };
      case (?index) {
        // Existing item, update quantity
        let mutableItems = existingItems.toVarArray<CartItem>();
        mutableItems[index] := {
          productId = item.productId;
          size = item.size;
          quantity = existingItems[index].quantity + item.quantity;
        };
        mutableItems.toArray();
      };
    };

    let cart : Cart = {
      items;
    };
    carts.add(caller, cart);
  };

  public shared ({ caller }) func removeFromCart(item : CartItem) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    if (item.quantity != 0) { Runtime.trap("To update quantity, use updateCartItemQuantity instead of removeFromCart") };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?cart) {
        let items = cart.items.filter(func(i) { i.productId != item.productId or i.size != item.size });
        carts.add(caller, { items });
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(item : CartItem) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };
    if (item.quantity == 0) { return await removeFromCart(item) };
    switch (products.get(item.productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        switch (product.stock.find(func(x) { x.0 == item.size })) {
          case (?(_, stock)) {
            if (stock < item.quantity) {
              Runtime.trap("Not enough stock for this item and size");
            };
          };
          case (_) { Runtime.trap("Size not available for this product") };
        };
      };
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?cart) {
        let index = cart.items.findIndex(func(i) { i.productId == item.productId and i.size == item.size });
        switch (index) {
          case (null) { Runtime.trap("Item does not exist in cart") };
          case (?itemIndex) {
            let mutableItems = cart.items.toVarArray<CartItem>();
            mutableItems[itemIndex] := item;
            carts.add(caller, { items = mutableItems.toArray() });
          };
        };
      };
    };
  };

  public shared ({ caller }) func clearCart(_ : ()) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?_) { carts.remove(caller) };
    };
  };

  // Order management
  public shared ({ caller }) func createOrder(_ : ()) : async Text {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart does not exist") };
      case (?cart) { cart };
    };

    if (cart.items.size() == 0) {
      Runtime.trap("Cart must not be empty");
    };

    let items : [OrderItem] = cart.items.map(func(item) = {
      productId = item.productId;
      size = item.size;
      quantity = item.quantity;
      priceCents = switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product in cart does not exist") };
        case (?product) { product.priceCents };
      };
    });

    let totalCents = items.foldLeft(
      0,
      func(acc, item) {
        acc + (item.priceCents * item.quantity);
      },
    );

    let orderId = Time.now().toText();

    let order : Order = {
      id = orderId;
      userId = caller;
      items;
      totalCents;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    carts.remove(caller);

    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (order.userId != caller and not Authorization.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getMyOrders(_ : ()) : async [Order] {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(order) { order.userId == caller });
  };

  public query ({ caller }) func getAllOrders(_ : ()) : async [Order] {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          totalCents = order.totalCents;
          status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Stripe integration
  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};
