import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  productId: string;
  productName: string;
  priceCents: number;
  size: string;
  quantity: number;
  imageUrl: string;
}

export interface DynamicCoupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  used: boolean;
}

const STATIC_COUPON_MAP: Record<
  string,
  { type: "percent" | "flat"; value: number }
> = {
  SPARK5: { type: "percent", value: 5 },
  FREESP: { type: "flat", value: 5000 },
};

function loadDynamicCoupons(): DynamicCoupon[] {
  try {
    const raw = localStorage.getItem("spark_dynamic_coupons");
    if (raw) return JSON.parse(raw) as DynamicCoupon[];
  } catch {
    // ignore
  }
  return [];
}

function persistDynamicCoupons(coupons: DynamicCoupon[]) {
  localStorage.setItem("spark_dynamic_coupons", JSON.stringify(coupons));
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  couponCode: string | null;
  couponDiscount: number;
  couponError: string | null;
  isFlatCoupon: boolean;
  flatCouponValue: number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  markCouponUsed: (code: string) => void;
  registerDynamicCoupon: (
    code: string,
    type: "percent" | "flat",
    value: number,
  ) => void;
  autoDiscount: number;
  effectiveDiscount: number;
  discountedTotal: number;
  totalSavings: number;
  showAddedPopup: boolean;
  lastAddedName: string;
  dismissAddedPopup: () => void;
  dynamicCoupons: DynamicCoupon[];
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isFlatCoupon, setIsFlatCoupon] = useState(false);
  const [flatCouponValue, setFlatCouponValue] = useState(0);
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const [lastAddedName, setLastAddedName] = useState("");
  const [dynamicCoupons, setDynamicCoupons] =
    useState<DynamicCoupon[]>(loadDynamicCoupons);

  const registerDynamicCoupon = useCallback(
    (code: string, type: "percent" | "flat", value: number) => {
      const upper = code.trim().toUpperCase();
      setDynamicCoupons((prev) => {
        // Don't re-register if already exists and not used
        if (prev.find((c) => c.code === upper && !c.used)) return prev;
        const filtered = prev.filter((c) => c.code !== upper);
        const next: DynamicCoupon[] = [
          ...filtered,
          { code: upper, type, value, used: false },
        ];
        persistDynamicCoupons(next);
        return next;
      });
    },
    [],
  );

  const markCouponUsed = useCallback((code: string) => {
    const upper = code.trim().toUpperCase();
    setDynamicCoupons((prev) => {
      const next = prev.map((c) =>
        c.code === upper ? { ...c, used: true } : c,
      );
      persistDynamicCoupons(next);
      return next;
    });
  }, []);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.size === newItem.size,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.size === newItem.size
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i,
        );
      }
      return [...prev, newItem];
    });
    setLastAddedName(newItem.productName);
    setShowAddedPopup(true);
  }, []);

  const dismissAddedPopup = useCallback(() => setShowAddedPopup(false), []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity } : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const applyCoupon = useCallback(
    (code: string) => {
      const upper = code.trim().toUpperCase();

      // Check dynamic coupons first
      const dynCoupon = dynamicCoupons.find((c) => c.code === upper);
      if (dynCoupon) {
        if (dynCoupon.used) {
          setCouponError("This coupon has already been used");
          setCouponCode(null);
          setCouponDiscount(0);
          setIsFlatCoupon(false);
          setFlatCouponValue(0);
          return;
        }
        setCouponError(null);
        setCouponCode(upper);
        if (dynCoupon.type === "flat") {
          setIsFlatCoupon(true);
          setFlatCouponValue(dynCoupon.value);
          setCouponDiscount(0);
        } else {
          setIsFlatCoupon(false);
          setFlatCouponValue(0);
          setCouponDiscount(dynCoupon.value);
        }
        return;
      }

      // Check static coupons
      const staticCoupon = STATIC_COUPON_MAP[upper];
      if (staticCoupon) {
        setCouponError(null);
        setCouponCode(upper);
        if (staticCoupon.type === "flat") {
          setIsFlatCoupon(true);
          setFlatCouponValue(staticCoupon.value);
          setCouponDiscount(0);
        } else {
          setIsFlatCoupon(false);
          setFlatCouponValue(0);
          setCouponDiscount(staticCoupon.value);
        }
        return;
      }

      setCouponError("Invalid coupon code. Earn coupons by shopping with us!");
      setCouponCode(null);
      setCouponDiscount(0);
      setIsFlatCoupon(false);
      setFlatCouponValue(0);
    },
    [dynamicCoupons],
  );

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponDiscount(0);
    setCouponError(null);
    setIsFlatCoupon(false);
    setFlatCouponValue(0);
  }, []);

  const total = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const autoDiscount = 0;

  const { effectiveDiscount, discountedTotal, totalSavings } = useMemo(() => {
    const effDisc = isFlatCoupon
      ? autoDiscount
      : Math.min(autoDiscount + couponDiscount, 100);
    let after = total - Math.round((total * effDisc) / 100);
    if (isFlatCoupon) after = Math.max(0, after - flatCouponValue);
    const savings = total - after;
    return {
      effectiveDiscount: effDisc,
      discountedTotal: after,
      totalSavings: savings,
    };
  }, [total, couponDiscount, isFlatCoupon, flatCouponValue]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
        isOpen,
        setIsOpen,
        couponCode,
        couponDiscount,
        couponError,
        isFlatCoupon,
        flatCouponValue,
        applyCoupon,
        removeCoupon,
        markCouponUsed,
        registerDynamicCoupon,
        autoDiscount,
        effectiveDiscount,
        discountedTotal,
        totalSavings,
        showAddedPopup,
        lastAddedName,
        dismissAddedPopup,
        dynamicCoupons,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
