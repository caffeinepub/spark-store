export default function DealBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #0a0a0a 0%, #1a0033 30%, #0a0a0a 50%, #1a0033 70%, #0a0a0a 100%)",
        borderTop: "1px solid rgba(123,0,255,0.45)",
        boxShadow:
          "0 -4px 24px rgba(123,0,255,0.25), 0 -1px 0 rgba(255,0,255,0.15)",
      }}
    >
      <style>{`
        @keyframes deal-bar-glow {
          0%,100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes deal-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .deal-card {
          animation: deal-bar-glow 2s ease-in-out infinite;
        }
        .deal-num {
          background: linear-gradient(90deg, #ff00ff, #00ffcc, #ffe000, #7b00ff, #ff00ff);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: deal-shimmer 2.5s linear infinite;
        }
      `}</style>

      {/* Left deal */}
      <div className="deal-card flex items-center gap-2 px-4 py-2 sm:px-6 border-r border-purple-900/50">
        <span className="text-lg sm:text-xl" aria-hidden="true">
          🛋️
        </span>
        <div className="text-center">
          <span
            className="deal-num font-black text-base sm:text-lg leading-none block"
            style={{ fontFamily: "'Bungee', 'Bebas Neue', sans-serif" }}
          >
            BUY 2
          </span>
          <span className="text-[10px] sm:text-xs text-purple-300 font-semibold tracking-widest uppercase">
            10% OFF Coupon After Purchase
          </span>
        </div>
      </div>

      {/* Divider spark */}
      <div
        className="px-2 sm:px-3 text-pink-500 font-black text-lg select-none"
        aria-hidden="true"
      >
        ⚡
      </div>

      {/* Right deal */}
      <div
        className="deal-card flex items-center gap-2 px-4 py-2 sm:px-6 border-l border-purple-900/50"
        style={{ animationDelay: "1s" }}
      >
        <span className="text-lg sm:text-xl" aria-hidden="true">
          🔥
        </span>
        <div className="text-center">
          <span
            className="deal-num font-black text-base sm:text-lg leading-none block"
            style={{ fontFamily: "'Bungee', 'Bebas Neue', sans-serif" }}
          >
            BUY 3+
          </span>
          <span className="text-[10px] sm:text-xs text-pink-300 font-semibold tracking-widest uppercase">
            20% OFF Coupon After Purchase
          </span>
        </div>
      </div>

      {/* Always SPARK5 note */}
      <div className="hidden sm:flex items-center gap-2 px-5 py-2 border-l border-purple-900/50">
        <span className="text-base" aria-hidden="true">
          🏷️
        </span>
        <div className="text-center">
          <span
            className="text-xs font-black text-purple-300 leading-none block tracking-widest uppercase"
            style={{ fontFamily: "'Bungee', 'Bebas Neue', sans-serif" }}
          >
            SPARK5
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
            Always 5% off
          </span>
        </div>
      </div>

      {/* Coupon note */}
      <div className="hidden md:flex items-center px-4 py-2 border-l border-purple-900/50">
        <p className="text-[10px] text-muted-foreground max-w-[120px] leading-snug text-center">
          Coupons revealed after purchase 🎁
        </p>
      </div>
    </div>
  );
}
