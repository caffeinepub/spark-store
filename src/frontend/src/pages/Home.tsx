import { Link } from "@tanstack/react-router";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "../components/ui/button";

const categories = [
  {
    label: "Tees",
    emoji: "👕",
    search: { category: "tshirt" },
    desc: "Bold graphic tees",
  },
  {
    label: "Hoodies",
    emoji: "🧥",
    search: { category: "hoodie" },
    desc: "Oversized drip",
  },
  {
    label: "Accessories",
    emoji: "🎒",
    search: { category: "accessories" },
    desc: "Complete the fit",
  },
] as const;

const tickerItems = [
  { id: "t1", text: "✨ FREE SHIPPING ON ALL ORDERS" },
  { id: "t2", text: "🔥 2 ITEMS → 10% OFF AT CHECKOUT" },
  { id: "t3", text: "⚡ 3 ITEMS → 20% OFF AT CHECKOUT" },
  { id: "t4", text: "💥 USE CODE SPARK5 FOR 5% OFF" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1400x700.jpg"
            alt="SPARK STORE"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-black/20 to-background" />
        </div>

        {/* Revolving orbital web lines */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="relative w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-20">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border border-purple-500"
              style={{ animation: "orbit-cw 18s linear infinite" }}
            />
            {/* Tilted ring 1 */}
            <div
              className="absolute inset-[8%] rounded-full border border-pink-500"
              style={{
                transform: "rotateX(65deg)",
                animation: "orbit-ccw 12s linear infinite",
              }}
            />
            {/* Tilted ring 2 */}
            <div
              className="absolute inset-[16%] rounded-full border border-purple-400"
              style={{
                transform: "rotateY(60deg)",
                animation: "orbit-cw 9s linear infinite",
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute inset-[28%] rounded-full border border-pink-400"
              style={{ animation: "orbit-ccw 6s linear infinite" }}
            />
            {/* Web grid lines horizontal */}
            <div
              className="absolute inset-0 rounded-full border border-purple-600/40"
              style={{
                transform: "rotateX(80deg)",
                animation: "orbit-cw 24s linear infinite",
              }}
            />
            {/* Dot on outer ring */}
            <div
              className="absolute top-1/2 left-0 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_4px_rgba(168,85,247,0.8)]"
              style={{ animation: "orbit-cw 18s linear infinite" }}
            />
            <div
              className="absolute top-0 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-pink-400 shadow-[0_0_10px_3px_rgba(236,72,153,0.8)]"
              style={{ animation: "orbit-ccw 12s linear infinite" }}
            />
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-600/40 rounded-full px-4 py-2 mb-8 text-sm font-medium text-purple-300">
            <Zap size={14} fill="currentColor" /> New Drop Available
          </div>

          <h1
            className="text-[clamp(4rem,15vw,12rem)] leading-none font-black mb-6"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            <span className="text-white">SPARK</span>
            <span className="neon-text glow-purple"> STORE</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-light tracking-widest uppercase">
            Wear the Energy. Drip Different.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              data-ocid="hero.primary_button"
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg glow-border"
            >
              <Link to="/shop" search={{ category: undefined }}>
                Shop Now <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border px-10 py-6 text-lg hover:bg-secondary"
            >
              <Link to="/shop" search={{ category: undefined }}>
                Explore All
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-purple-500" />
        </div>
      </section>

      {/* Orbit animations */}
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* ── MARQUEE TICKER ── */}
      <div
        className="w-full overflow-hidden py-4 relative"
        style={{
          background:
            "linear-gradient(90deg, #4c1d95 0%, #7c3aed 30%, #db2777 60%, #7c3aed 80%, #4c1d95 100%)",
          borderTop: "1px solid rgba(167,139,250,0.3)",
          borderBottom: "1px solid rgba(167,139,250,0.3)",
        }}
      >
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{
            animation: "marquee 22s linear infinite",
            width: "max-content",
          }}
        >
          {[
            ...tickerItems.map((i) => ({ ...i, id: `a-${i.id}` })),
            ...tickerItems.map((i) => ({ ...i, id: `b-${i.id}` })),
            ...tickerItems.map((i) => ({ ...i, id: `c-${i.id}` })),
          ].map((item) => (
            <span
              key={item.id}
              className="text-white font-black text-sm tracking-widest uppercase"
              style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1rem" }}
            >
              {item.text}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>

      {/* Categories */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2
          className="text-5xl md:text-7xl font-black text-center mb-16 text-white"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to="/shop"
              search={cat.search}
              className="group relative bg-card border border-border rounded-2xl p-8 card-hover flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-colors" />
              <span className="text-6xl mb-4">{cat.emoji}</span>
              <h3
                className="text-3xl font-black"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {cat.label}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">{cat.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-purple-400 text-sm font-medium">
                Shop {cat.label} <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-5xl md:text-8xl font-black mb-6"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            <span className="text-muted-foreground">NOT JUST</span>
            <br />
            <span className="neon-text glow-purple">CLOTHES</span>
            <br />
            <span className="text-muted-foreground">IT'S A</span>
            <br />
            <span className="text-white">MOVEMENT</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            SPARK STORE is built for the ones who don't blend in. Every piece is
            made to make a statement. Unisex. Oversized. Unapologetic.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-2xl font-black"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            SPARK<span className="neon-text"> STORE</span>
          </p>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link
              to="/shop"
              search={{ category: undefined }}
              className="hover:text-white transition-colors"
            >
              Shop
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
