import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } =
    useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        role="presentation"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Your Cart ({items.length})
          </h2>
          <button
            type="button"
            data-ocid="cart.close_button"
            onClick={() => setIsOpen(false)}
            className="p-2 hover:text-purple-400"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}`}
                data-ocid={`cart.item.${idx + 1}`}
                className="flex gap-4 bg-secondary rounded-xl p-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Size: {item.size}
                  </p>
                  <p className="text-purple-400 font-bold">
                    ${(item.priceCents / 100).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1,
                        )
                      }
                      className="p-1 rounded bg-border hover:bg-purple-600 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity + 1,
                        )
                      }
                      className="p-1 rounded bg-border hover:bg-purple-600 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size)}
                      className="ml-auto p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-purple-400">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            <Button
              data-ocid="cart.checkout_button"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 glow-border"
              onClick={() => {
                setIsOpen(false);
                navigate({ to: "/checkout" });
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
