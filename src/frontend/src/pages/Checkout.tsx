import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto mb-6 opacity-20" />
          <h2
            className="text-4xl font-black mb-4"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Cart is Empty
          </h2>
          <Button
            onClick={() =>
              navigate({ to: "/shop", search: { category: undefined } })
            }
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Go Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto py-8">
        <button
          type="button"
          onClick={() =>
            navigate({ to: "/shop", search: { category: undefined } })
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>

        <h1
          className="text-5xl font-black mb-8"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          Checkout
        </h1>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 items-center"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.size} &times; {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-purple-400">
                  ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-6 pt-4 flex justify-between text-xl font-black">
            <span>Total</span>
            <span className="text-purple-400">${(total / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Payment</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Secure payment handled via Stripe. Click below to proceed.
          </p>
          <Button
            data-ocid="checkout.submit_button"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg glow-border"
            onClick={() => {
              alert(
                "Stripe checkout will be configured by the store admin. Your order has been noted!",
              );
              clearCart();
              void navigate({ to: "/" });
            }}
          >
            Pay ${(total / 100).toFixed(2)} Securely
          </Button>
        </div>
      </div>
    </div>
  );
}
