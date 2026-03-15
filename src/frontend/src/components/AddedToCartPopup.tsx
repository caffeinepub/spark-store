import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

export default function AddedToCartPopup() {
  const { showAddedPopup, lastAddedName, dismissAddedPopup } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showAddedPopup) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dismissAddedPopup();
      }, 2400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showAddedPopup, dismissAddedPopup]);

  if (!showAddedPopup) return null;

  const confettiColors = [
    "#ff00ff",
    "#00ffcc",
    "#ffe000",
    "#7b00ff",
    "#ff4500",
    "#ff0066",
    "#00aaff",
    "#aaff00",
  ];
  const n = confettiColors.length;

  return (
    <>
      <style>{`
        @keyframes crazy-pop-in {
          0%   { transform: scale(0.2) rotate(-12deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          80%  { transform: scale(0.94) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes glitch-shift {
          0%,100% { text-shadow: 3px 0 #ff00ff, -3px 0 #00ffff; transform: translate(0); }
          25% { text-shadow: -4px 0 #ff00ff, 4px 0 #00ffff; transform: translate(-2px,1px) skewX(-2deg); }
          50% { text-shadow: 4px 0 #ff00ff, -4px 0 #00ffff; transform: translate(2px,-1px) skewX(2deg); }
          75% { text-shadow: -3px 0 #ff00ff, 3px 0 #00ffff; transform: translate(-1px,2px); }
        }
        @keyframes neon-cycle {
          0%   { color: #ff00ff; }
          16%  { color: #ff4500; }
          33%  { color: #00ffcc; }
          50%  { color: #ffe000; }
          66%  { color: #7b00ff; }
          83%  { color: #ff0066; }
          100% { color: #ff00ff; }
        }
        @keyframes zoom-pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        @keyframes wiggle-cart {
          0%,100% { transform: rotate(-6deg) scale(1.1); }
          50% { transform: rotate(6deg) scale(1.2); }
        }
        @keyframes confetti-burst-0  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(130px,0px)   rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-1  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(92px,92px)   rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-2  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(0px,130px)   rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-3  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(-92px,92px)  rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-4  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(-130px,0px)  rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-5  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(-92px,-92px) rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-6  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(0px,-130px)  rotate(720deg) scale(0.3);opacity:0} }
        @keyframes confetti-burst-7  { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(92px,-92px)  rotate(720deg) scale(0.3);opacity:0} }
        .added-box { animation: crazy-pop-in 0.4s cubic-bezier(.17,.67,.38,1.4) forwards; }
        .glitch-heading { animation: glitch-shift 0.14s steps(1) infinite; font-family: 'Bungee', 'Bebas Neue', sans-serif; }
        .neon-cycle-span { animation: neon-cycle 0.5s linear infinite; font-family: 'Bungee Shade', 'Bebas Neue', sans-serif; }
        .zoom-pulse-item { animation: zoom-pulse 0.45s ease-in-out infinite; }
        .wiggle-cart-icon { animation: wiggle-cart 0.22s ease-in-out infinite; }
      `}</style>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: popup dismiss on click */}
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.70)", backdropFilter: "blur(6px)" }}
        onClick={dismissAddedPopup}
      >
        {confettiColors.map((color, i) => (
          <div
            key={color}
            className="absolute w-3 h-3 rounded-sm pointer-events-none"
            style={{
              background: color,
              top: "50%",
              left: "50%",
              marginTop: "-6px",
              marginLeft: "-6px",
              animation: `confetti-burst-${i % n} 1s ease-out ${i * 0.05}s forwards`,
            }}
          />
        ))}

        {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation */}
        <div
          className="added-box relative bg-black border-2 rounded-3xl px-10 py-8 text-center max-w-xs w-full mx-4 overflow-hidden"
          style={{
            borderColor: "#7b00ff",
            boxShadow:
              "0 0 60px #7b00ff, 0 0 120px #ff00ff55, inset 0 0 30px rgba(123,0,255,0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
            }}
          />

          <div className="wiggle-cart-icon text-5xl mb-3 select-none">🛒⚡</div>

          <div className="glitch-heading text-4xl font-black leading-none tracking-widest text-white">
            BOOM!
          </div>
          <div className="neon-cycle-span text-5xl font-black leading-none mt-1">
            IN YOUR BAG
          </div>

          <p
            className="mt-4 text-sm font-bold uppercase tracking-widest zoom-pulse-item"
            style={{
              fontFamily: "'Permanent Marker', cursive",
              background:
                "linear-gradient(90deg,#ff00ff,#00ffcc,#ffe000,#7b00ff,#ff00ff)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {lastAddedName}
          </p>

          <p
            className="mt-3 text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Pacifico', cursive", color: "#00ffcc" }}
          >
            cart is cooking 🔥
          </p>
        </div>
      </div>
    </>
  );
}
