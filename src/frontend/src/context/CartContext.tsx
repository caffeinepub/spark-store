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

const COUPON_MAP: Record<string, { type: "percent" | "flat"; value: number }> =
  {
    SPARK5: { type: "percent", value: 5 },
    SPARK8: { type: "percent", value: 8 },
    SPARK10: { type: "percent", value: 10 },
    SPARK15: { type: "percent", value: 15 },
    FREESP: { type: "flat", value: 5000 }, // ₹50 flat off in paise
    SPARK20: { type: "percent", value: 20 },
  };

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
  // Coupon
  couponCode: string | null;
  couponDiscount: number;
  couponError: string | null;
  isFlatCoupon: boolean;
  flatCouponValue: number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  // Discounts
  autoDiscount: number;
  effectiveDiscount: number;
  discountedTotal: number;
  totalSavings: number;
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
  }, []);

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

  const applyCoupon = useCallback((code: string) => {
    const upper = code.trim().toUpperCase();
    const coupon = COUPON_MAP[upper];
    if (!coupon) {
      setCouponError("Invalid coupon code");
      setCouponCode(null);
      setCouponDiscount(0);
      setIsFlatCoupon(false);
      setFlatCouponValue(0);
      return;
    }
    setCouponError(null);
    setCouponCode(upper);
    if (coupon.type === "flat") {
      setIsFlatCoupon(true);
      setFlatCouponValue(coupon.value);
      setCouponDiscount(0);
    } else {
      setIsFlatCoupon(false);
      setFlatCouponValue(0);
      setCouponDiscount(coupon.value);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponDiscount(0);
    setCouponError(null);
    setIsFlatCoupon(false);
    setFlatCouponValue(0);
  }, []);

  const total = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  // 1 item = 0%, 2 items = 10%, 3+ items = 20%
  const autoDiscount = count === 2 ? 10 : count >= 3 ? 20 : 0;

  const { effectiveDiscount, discountedTotal, totalSavings } = useMemo(() => {
    // Percent coupons STACK on top of auto discount (e.g. SPARK5 always gives 5% extra)
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
  }, [total, autoDiscount, couponDiscount, isFlatCoupon, flatCouponValue]);

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
        autoDiscount,
        effectiveDiscount,
        discountedTotal,
        totalSavings,
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
