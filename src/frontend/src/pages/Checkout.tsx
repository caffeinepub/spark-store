import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Flame,
  Phone,
  ShoppingBag,
  Smartphone,
  Star,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useCart } from "../context/CartContext";

type Step = "summary" | "payment" | "success";

const WHATSAPP_URL =
  "https://wa.me/918780034074?text=Hi%20SPARK%20STORE!%20%F0%9F%91%8B%20I%20just%20placed%20an%20order%20and%20wanted%20to%20connect%20for%20delivery%20details.%20Please%20help%20me%20with%20my%20order.%20Thank%20you!%20%F0%9F%94%A5";

export default function Checkout() {
  const {
    items,
    total,
    count,
    clearCart,
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
  } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("summary");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [orderItemCount, setOrderItemCount] = useState(0);
  const [couponInput, setCouponInput] = useState("");

  const handleCopyUPI = () => {
    void navigator.clipboard.writeText("8780034074@fam");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrderComplete = () => {
    clearCart();
    void navigate({ to: "/" });
  };

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "#000" }}
      >
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

  const autoDiscountAmount = Math.round((total * autoDiscount) / 100);
  const couponDiscountAmount = isFlatCoupon
    ? flatCouponValue
    : Math.round((total * couponDiscount) / 100);

  const showAutoDiscount = autoDiscount > 0;
  const showCouponLine =
    couponCode !== null && (isFlatCoupon || couponDiscount > 0);

  // Label for applied coupon: always show the coupon's own value
  const couponLabel = isFlatCoupon
    ? `₹${(flatCouponValue / 100).toFixed(0)} flat off!`
    : `${couponDiscount}% off!`;

  return (
    <div
      className="min-h-screen pt-20 pb-16 px-4"
      style={{ background: "#050505" }}
    >
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

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(["summary", "payment"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50"
                    : step === "success" ||
                        (s === "summary" && step === "payment")
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-muted-foreground"
                }`}
              >
                {step === "success" ||
                (s === "summary" && step === "payment") ? (
                  <CheckCircle size={16} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm font-medium capitalize ${step === s ? "text-white" : "text-muted-foreground"}`}
              >
                {s === "summary" ? "Order Summary" : "Payment"}
              </span>
              {i < 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        <h1
          className="text-5xl font-black mb-8"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          {step === "summary" ? "Checkout" : "Pay Now"}
        </h1>

        {/* STEP 1: ORDER SUMMARY */}
        {step === "summary" && (
          <>
            <div
              className="rounded-2xl p-6 mb-4"
              style={{ background: "#0d0d0d", border: "1px solid #1e1e1e" }}
            >
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
                      ₹{((item.priceCents * item.quantity) / 100).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-discount banner */}
            {autoDiscount > 0 && (
              <div
                className="rounded-xl px-5 py-3 mb-4 flex items-center gap-3"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.35)",
                }}
              >
                <span className="text-xl">🔥</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#c4b5fd" }}>
                    {count === 2
                      ? "Bundle Deal — 10% OFF Applied!"
                      : "Triple+ Deal — 20% OFF Applied!"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Auto-discount active — no code needed
                  </p>
                </div>
              </div>
            )}

            {/* Coupon code section */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: "#0d0d0d", border: "1px solid #1e1e1e" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-purple-400" />
                <p className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                  Apply Coupon Code
                </p>
              </div>

              {couponCode ? (
                <div
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.3)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="font-black text-green-300 tracking-wider">
                      {couponCode}
                    </span>
                    <span className="text-green-400 text-sm font-semibold">
                      {couponLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setCouponInput("");
                    }}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    data-ocid="checkout.coupon_input"
                    type="text"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Enter your reward coupon code"
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-widest outline-none transition-all"
                    style={{
                      background: "#0a0a1a",
                      border: "1px solid #2d1b69",
                      color: "#e2e8f0",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid="checkout.coupon_apply_button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-3 rounded-xl font-black text-sm text-white tracking-wider uppercase transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                      boxShadow: "0 0 14px rgba(124,58,237,0.4)",
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <X size={12} /> {couponError}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Try <span className="text-purple-400 font-bold">SPARK5</span>{" "}
                for 5% off on any order!
              </p>
            </div>

            {/* Totals breakdown */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{ background: "#0d0d0d", border: "1px solid #1e1e1e" }}
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({count} item{count !== 1 ? "s" : ""})
                  </span>
                  <span className="text-white">
                    ₹{(total / 100).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-400 font-bold">FREE 🚚</span>
                </div>
                {showAutoDiscount && (
                  <div className="flex justify-between">
                    <span className="text-green-400">
                      Auto Discount ({autoDiscount}%)
                    </span>
                    <span className="text-green-400">
                      −₹{(autoDiscountAmount / 100).toFixed(0)}
                    </span>
                  </div>
                )}
                {showCouponLine && (
                  <div className="flex justify-between">
                    <span className="text-green-400">
                      Coupon ({couponCode})
                      {isFlatCoupon
                        ? " — Flat off"
                        : ` — ${couponDiscount}% off`}
                    </span>
                    <span className="text-green-400">
                      −₹{(couponDiscountAmount / 100).toFixed(0)}
                    </span>
                  </div>
                )}
                {totalSavings > 0 && (
                  <div
                    className="flex justify-between rounded-lg px-3 py-2 mt-1"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    <span className="text-green-400 font-bold">
                      🎉 You Save
                    </span>
                    <span className="text-green-400 font-bold">
                      ₹{(totalSavings / 100).toFixed(0)}
                    </span>
                  </div>
                )}
                {effectiveDiscount > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total discount applied</span>
                    <span className="text-purple-400 font-bold">
                      {effectiveDiscount}%
                    </span>
                  </div>
                )}
                <div
                  className="flex justify-between pt-3 mt-1 text-xl font-black"
                  style={{ borderTop: "1px solid #1e1e1e" }}
                >
                  <span className="text-white">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    ₹{(discountedTotal / 100).toFixed(0)}
                    {totalSavings > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ₹{(total / 100).toFixed(0)}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* No COD notice */}
            <div
              className="rounded-xl px-5 py-3 mb-6 flex items-center gap-3"
              style={{ background: "#1a0a0a", border: "1px solid #3f1010" }}
            >
              <span className="text-red-400 text-lg">🚫</span>
              <p className="text-sm text-red-300 font-medium">
                Cash on Delivery (COD) is not available. Online payment only.
              </p>
            </div>

            <Button
              data-ocid="checkout.proceed_to_pay_button"
              className="w-full py-6 text-lg font-black tracking-wider glow-border"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                color: "white",
              }}
              onClick={() => setStep("payment")}
            >
              <Zap size={18} className="mr-2" /> Proceed to Pay ₹
              {(discountedTotal / 100).toFixed(0)}
              {totalSavings > 0 && (
                <span className="ml-2 text-sm line-through opacity-60">
                  ₹{(total / 100).toFixed(0)}
                </span>
              )}
            </Button>
          </>
        )}

        {/* STEP 2: PAYMENT */}
        {step === "payment" && (
          <div className="space-y-6">
            {/* QR Code */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: "#0d0d0d", border: "1px solid #2d1b69" }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Smartphone className="text-purple-400" size={20} />
                <h2 className="text-xl font-bold">Scan QR Code to Pay</h2>
              </div>
              <div
                className="inline-block rounded-2xl p-3 mb-4"
                style={{ background: "#fff" }}
              >
                <img
                  src="/assets/generated/upi-qr-code.dim_400x450.png"
                  alt="UPI QR Code"
                  className="w-52 h-auto rounded-xl"
                />
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                Open any UPI app and scan the QR code
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"].map(
                  (app) => (
                    <span
                      key={app}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "#1e1040",
                        color: "#a78bfa",
                        border: "1px solid #3b2a6e",
                      }}
                    >
                      {app}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* UPI ID */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#0d0d0d", border: "1px solid #1e1e1e" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h2 className="text-xl font-bold">Pay via UPI ID</h2>
              </div>
              <div
                className="flex items-center justify-between rounded-xl px-5 py-4 mb-3"
                style={{ background: "#0a0a1a", border: "1px solid #2d1b69" }}
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                  <p className="text-lg font-black text-purple-300 tracking-wider">
                    8780034074@fam
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUPI}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: copied ? "#166534" : "#2d1b69",
                    color: copied ? "#86efac" : "#a78bfa",
                  }}
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Open your UPI app → Send Money → Enter UPI ID → Enter amount{" "}
                <span className="font-bold text-white">
                  ₹{(discountedTotal / 100).toFixed(0)}
                </span>{" "}
                → Pay
              </p>
            </div>

            {/* Amount reminder */}
            <div
              className="rounded-xl px-5 py-4"
              style={{
                background: "linear-gradient(135deg, #1a0f2e, #0f1a2e)",
                border: "1px solid #2d1b69",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    ₹{(discountedTotal / 100).toFixed(0)}
                  </p>
                </div>
                <Flame className="text-orange-400" size={36} />
              </div>
              {totalSavings > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-400 text-sm font-bold">
                    🎉 You're saving ₹{(totalSavings / 100).toFixed(0)} on this
                    order!
                  </span>
                </div>
              )}
            </div>

            <Button
              data-ocid="checkout.submit_button"
              className="w-full py-6 text-lg font-black tracking-wider"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                color: "white",
                boxShadow: "0 0 24px rgba(5, 150, 105, 0.4)",
              }}
              onClick={() => {
                setOrderItemCount(count);
                setStep("success");
              }}
            >
              <CheckCircle size={20} className="mr-2" /> I've Paid — Confirm
              Order
            </Button>

            <button
              type="button"
              onClick={() => setStep("summary")}
              className="w-full text-center text-sm text-muted-foreground hover:text-white transition-colors"
            >
              ← Back to Order Summary
            </button>
          </div>
        )}
      </div>

      {/* SUCCESS DIALOG */}
      <Dialog
        open={step === "success"}
        onOpenChange={(open) => {
          if (!open) handleOrderComplete();
        }}
      >
        <DialogContent
          data-ocid="order.success.dialog"
          className="max-w-md text-center p-0 overflow-hidden"
          style={{ background: "#050505", border: "1px solid #2d1b69" }}
        >
          <div
            className="w-full py-8 px-6 flex flex-col items-center"
            style={{
              background: "linear-gradient(160deg, #1a0533 0%, #0a0f2e 100%)",
              borderBottom: "1px solid #2d1b69",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #7c3aed40, #db277740)",
                border: "2px solid #7c3aed",
                boxShadow: "0 0 30px #7c3aed60",
              }}
            >
              <CheckCircle className="text-purple-400" size={40} />
            </div>
            <DialogHeader>
              <DialogTitle
                className="text-3xl font-black text-white"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Order Confirmed! 🔥
              </DialogTitle>
            </DialogHeader>
            <p className="text-purple-300 mt-2 font-semibold">
              Thanks for shopping with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-black">
                SPARK STORE
              </span>
              !
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              You're a vibe! We'll get your fit to you ASAP. Stay stylish! ✨
            </p>
          </div>

          <div className="py-5 px-6 space-y-5">
            {/* Delivery contact + WhatsApp */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#0d0d1a", border: "1px solid #2d1b69" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Phone className="text-purple-400 shrink-0" size={22} />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    For delivery, contact us at:
                  </p>
                  <p className="text-xl font-black text-purple-300 tracking-widest">
                    8780034074
                  </p>
                </div>
              </div>
              {/* WhatsApp CTA */}
              <a
                data-ocid="order.whatsapp.button"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: "#25D366",
                  boxShadow: "0 0 18px rgba(37,211,102,0.45)",
                }}
              >
                {/* WhatsApp SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp for Delivery
              </a>
            </div>

            {/* Earned coupon reveal */}
            {(orderItemCount === 2 || orderItemCount >= 3) && (
              <div
                className="rounded-xl p-5"
                style={{
                  background: "linear-gradient(135deg, #1a0030, #0a0a2e)",
                  border: "2px solid transparent",
                  backgroundClip: "padding-box",
                  boxShadow:
                    orderItemCount >= 3
                      ? "0 0 24px rgba(236,72,153,0.5), inset 0 0 40px rgba(124,58,237,0.1)"
                      : "0 0 24px rgba(124,58,237,0.5), inset 0 0 40px rgba(236,72,153,0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glowing border overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    padding: "2px",
                    background:
                      orderItemCount >= 3
                        ? "linear-gradient(135deg, #ec4899, #7c3aed, #06b6d4)"
                        : "linear-gradient(135deg, #7c3aed, #ec4899, #a855f7)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                  }}
                />
                <div className="flex items-center gap-2 justify-center mb-3">
                  <span className="text-2xl">🎉</span>
                  <p
                    className="font-black text-sm uppercase tracking-wider"
                    style={{
                      background:
                        orderItemCount >= 3
                          ? "linear-gradient(135deg, #ec4899, #a855f7)"
                          : "linear-gradient(135deg, #a855f7, #ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {orderItemCount >= 3
                      ? "You earned 20% OFF for buying 3+ items!"
                      : "You earned 10% OFF for buying 2 items!"}
                  </p>
                </div>
                <div
                  className="rounded-lg px-4 py-3 text-center mb-3"
                  style={{
                    background: "rgba(124,58,237,0.12)",
                    border: "1px dashed rgba(168,85,247,0.5)",
                  }}
                >
                  <p
                    className="font-black text-3xl tracking-[0.3em]"
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      background:
                        orderItemCount >= 3
                          ? "linear-gradient(135deg, #ec4899, #a855f7, #06b6d4)"
                          : "linear-gradient(135deg, #a855f7, #ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {orderItemCount >= 3 ? "SPARK20" : "SPARK10"}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="order.earned_coupon.button"
                  onClick={() =>
                    handleCopyCode(orderItemCount >= 3 ? "SPARK20" : "SPARK10")
                  }
                  className="w-full py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105"
                  style={{
                    background:
                      orderItemCount >= 3
                        ? "linear-gradient(135deg, #ec4899, #7c3aed)"
                        : "linear-gradient(135deg, #7c3aed, #ec4899)",
                    boxShadow: "0 0 14px rgba(124,58,237,0.4)",
                  }}
                >
                  {copiedCode ? "✓ Copied!" : "Copy Code"}
                </button>
                <p className="text-xs text-white/50 text-center mt-2">
                  Use this code at checkout on your next order
                </p>
              </div>
            )}
            {/* Social share nudge */}
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "#0a1a0a", border: "1px solid #1a3a1a" }}
            >
              <Star className="text-green-400 shrink-0" size={20} />
              <p className="text-sm text-green-300">
                Tag us <span className="font-bold">@sparkstore</span> on
                Instagram & get featured on our page! 🌟
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <Button
              data-ocid="order.success.close_button"
              className="w-full py-5 text-base font-bold"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                color: "white",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              }}
              onClick={handleOrderComplete}
            >
              Done — Back to Home 🔥
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
