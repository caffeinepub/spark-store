import { Link, useSearch } from "@tanstack/react-router";
import { ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";

const SAMPLE_PRODUCTS = [
  {
    id: "s1",
    name: "SPARK Classic Tee",
    priceCents: 2499,
    category: "tshirt",
    featured: true,
    imageUrl: "/assets/generated/tshirt-1.dim_600x700.jpg",
    description: "The OG graphic tee. Bold. Clean. Yours.",
  },
  {
    id: "s2",
    name: "YUG Oversized Tee",
    priceCents: 2799,
    category: "tshirt",
    featured: false,
    imageUrl: "/assets/generated/tshirt-2.dim_600x700.jpg",
    description: "Oversized fit for maximum drip.",
  },
  {
    id: "s3",
    name: "SPARK Pullover Hoodie",
    priceCents: 4999,
    category: "hoodie",
    featured: true,
    imageUrl: "/assets/generated/hoodie-1.dim_600x700.jpg",
    description: "The hoodie that hits different.",
  },
  {
    id: "s4",
    name: "YUG Zip Hoodie",
    priceCents: 5499,
    category: "hoodie",
    featured: false,
    imageUrl: "/assets/generated/hoodie-2.dim_600x700.jpg",
    description: "Street-ready zip-up with neon accents.",
  },
  {
    id: "s5",
    name: "SPARK STORE Cap",
    priceCents: 1899,
    category: "accessories",
    featured: false,
    imageUrl: "/assets/generated/accessories-1.dim_600x700.jpg",
    description: "Cap the fit off right.",
  },
  {
    id: "s6",
    name: "Energy Tote Bag",
    priceCents: 1499,
    category: "accessories",
    featured: false,
    imageUrl: "/assets/generated/accessories-1.dim_600x700.jpg",
    description: "Carry the energy everywhere.",
  },
];

const CATEGORIES = ["all", "tshirt", "hoodie", "accessories"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  tshirt: "T-Shirts",
  hoodie: "Hoodies",
  accessories: "Accessories",
};
const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function Shop() {
  const search = useSearch({ from: "/shop" }) as { category?: string };
  const [activeCategory, setActiveCategory] = useState<string>(
    search.category || "all",
  );
  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    setActiveCategory(search.category || "all");
  }, [search.category]);

  const filtered = SAMPLE_PRODUCTS.filter(
    (p) => activeCategory === "all" || p.category === activeCategory,
  );

  const handleQuickAdd = (product: (typeof SAMPLE_PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      productName: product.name,
      priceCents: product.priceCents,
      size: "M",
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="py-12 text-center">
          <h1
            className="text-6xl md:text-8xl font-black"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            The Drop
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Fresh fits. No compromise.
          </p>
        </div>

        <div
          className="flex items-center gap-3 mb-10 flex-wrap justify-center"
          role="tablist"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid="shop.tab"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? "bg-purple-600 border-purple-600 text-white glow-border"
                  : "border-border text-muted-foreground hover:border-purple-600 hover:text-white"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div
            className="text-center py-24 text-muted-foreground"
            data-ocid="shop.empty_state"
          >
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
            <p>No products yet in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, idx) => (
              <div
                key={product.id}
                data-ocid={`product.item.${idx + 1}`}
                className="bg-card border border-border rounded-2xl overflow-hidden card-hover group"
              >
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-purple-600 text-white border-0">
                        <Star size={10} fill="white" className="mr-1" />{" "}
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="absolute top-3 right-3 border-border bg-background/80 text-xs"
                    >
                      {CATEGORY_LABELS[product.category]}
                    </Badge>
                  </div>
                </Link>
                <div className="p-5">
                  <Link to="/product/$id" params={{ id: product.id }}>
                    <h3 className="font-bold text-lg hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-purple-400">
                      ${(product.priceCents / 100).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      data-ocid="product.add_button"
                      onClick={() => handleQuickAdd(product)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {SIZES.map((s) => (
                      <span
                        key={s}
                        className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
