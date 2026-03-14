import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Flame,
  Phone,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useCart } from "../context/CartContext";

type Step = "summary" | "payment" | "success";

const SCRATCH_REWARDS = [
  { label: "10% OFF", code: "SPARK10", color: "from-pink-500 to-purple-600" },
  { label: "FREE SHIP", code: "FREESP", color: "from-cyan-500 to-blue-600" },
  { label: "15% OFF", code: "SPARK15", color: "from-yellow-400 to-orange-500" },
  { label: "8% OFF", code: "SPARK8", color: "from-green-400 to-teal-500" },
];

function ScratchCard({
  onReveal,
}: {
  onReveal: (reward: { label: string; code: string; color: string }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratched, setScratched] = useState(false);
  const reward = useRef(
    SCRATCH_REWARDS[Math.floor(Math.random() * SCRATCH_REWARDS.length)],
  );
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#1a0a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH HERE ✦", canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = "#a78bfa";
    ctx.font = "13px sans-serif";
    ctx.fillText(
      "Win a secret reward",
      canvas.width / 2,
      canvas.height / 2 + 14,
    );
  }, []);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (scratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparent++;
    }
    const pct = (transparent / (canvas.width * canvas.height)) * 100;
    if (pct > 45 && !scratched) {
      setScratched(true);
      onReveal(reward.current);
    }
  };

  const handleMouseDown = () => {
    isDrawing.current = true;
  };
  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing.current) scratch(e);
  };

  return (
    <div
      className="relative w-full"
      style={{ maxWidth: 300, margin: "0 auto" }}
    >
      <div
        className={`w-full rounded-2xl overflow-hidden bg-gradient-to-br ${reward.current.color} flex items-center justify-center`}
        style={{ height: 100 }}
      >
        <div className="text-center">
          <p className="text-white font-black text-3xl tracking-wider">
            {reward.current.label}
          </p>
          <p className="text-white/80 text-sm font-mono mt-1">
            {reward.current.code}
          </p>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={scratch}
        className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer"
        style={{
          touchAction: "none",
          opacity: scratched ? 0 : 1,
          transition: "opacity 0.5s",
        }}
      />
      {!scratched && (
        <div className="absolute bottom-2 right-3 text-purple-400 text-xs animate-pulse">
          scratch me
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("summary");
  const [copied, setCopied] = useState(false);
  const [revealedReward, setRevealedReward] = useState<{
    label: string;
    code: string;
    color: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
                className={`text-sm font-medium capitalize ${
                  step === s ? "text-white" : "text-muted-foreground"
                }`}
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
              className="rounded-2xl p-6 mb-6"
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
              <div
                className="border-t mt-6 pt-4 flex justify-between text-xl font-black"
                style={{ borderColor: "#1e1e1e" }}
              >
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ₹{(total / 100).toFixed(0)}
                </span>
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
              {(total / 100).toFixed(0)}
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
                  ₹{(total / 100).toFixed(0)}
                </span>{" "}
                → Pay
              </p>
            </div>

            {/* Amount reminder */}
            <div
              className="rounded-xl px-5 py-4 flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, #1a0f2e, #0f1a2e)",
                border: "1px solid #2d1b69",
              }}
            >
              <div>
                <p className="text-xs text-muted-foreground">Amount to Pay</p>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ₹{(total / 100).toFixed(0)}
                </p>
              </div>
              <Flame className="text-orange-400" size={36} />
            </div>

            <Button
              data-ocid="checkout.submit_button"
              className="w-full py-6 text-lg font-black tracking-wider"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                color: "white",
                boxShadow: "0 0 24px rgba(5, 150, 105, 0.4)",
              }}
              onClick={() => setStep("success")}
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
          {/* Top gradient banner */}
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
            {/* Delivery contact */}
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "#0d0d1a", border: "1px solid #2d1b69" }}
            >
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

            {/* Scratch Card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "#0d0d1a", border: "1px solid #1e1040" }}
            >
              <div className="flex items-center gap-2 justify-center mb-3">
                <Sparkles className="text-pink-400" size={18} />
                <p className="text-pink-400 font-bold text-sm uppercase tracking-wide">
                  🎁 Scratch Your Secret Reward
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-4 text-center">
                Scratch the card below to reveal your exclusive discount!
              </p>
              <ScratchCard onReveal={(r) => setRevealedReward(r)} />
              {revealedReward && (
                <div className="mt-4 text-center animate-in fade-in duration-500">
                  <p className="text-sm text-muted-foreground mb-2">
                    🎉 You won! Use this code at checkout:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(revealedReward.code)}
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xl tracking-widest text-white bg-gradient-to-r ${revealedReward.color}`}
                  >
                    {revealedReward.code}
                    <Copy size={16} />
                  </button>
                  {copiedCode && (
                    <p className="text-green-400 text-xs mt-1">
                      Copied to clipboard!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 5% base coupon */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#1a1400", border: "1px solid #4d3800" }}
            >
              <div className="flex items-center gap-2 justify-center mb-2">
                <Tag className="text-yellow-400" size={16} />
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-wide">
                  Always-On Coupon
                </p>
              </div>
              <div
                className="rounded-lg px-4 py-2 text-center"
                style={{
                  background: "rgba(234,179,8,0.08)",
                  border: "1px dashed rgba(234,179,8,0.4)",
                }}
              >
                <p
                  className="text-yellow-300 font-black text-2xl tracking-[0.3em]"
                  style={{ fontFamily: "Bebas Neue, sans-serif" }}
                >
                  SPARK5
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                5% off your next order — always active
              </p>
            </div>

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
