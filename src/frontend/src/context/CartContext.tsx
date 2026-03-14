import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  priceCents: number;
  size: string;
  quantity: number;
  imageUrl: string;
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
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const total = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

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
