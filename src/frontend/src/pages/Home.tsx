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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x600.jpg"
            alt="SPARK STORE"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
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
            &copy; {new Date().getFullYear()} SPARK STORE. All rights reserved.
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
