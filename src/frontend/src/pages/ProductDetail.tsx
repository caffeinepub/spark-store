import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
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
    description:
      "The OG graphic tee. Bold. Clean. Yours. Made from 100% premium cotton with a relaxed fit. The SPARK STORE lightning bolt graphic is heat-pressed for durability that lasts.",
  },
  {
    id: "s2",
    name: "YUG Oversized Tee",
    priceCents: 2799,
    category: "tshirt",
    featured: false,
    imageUrl: "/assets/generated/tshirt-2.dim_600x700.jpg",
    description:
      "Oversized fit for maximum drip. Drop-shoulder silhouette with a neon purple print. Unisex sizing.",
  },
  {
    id: "s3",
    name: "SPARK Pullover Hoodie",
    priceCents: 4999,
    category: "hoodie",
    featured: true,
    imageUrl: "/assets/generated/hoodie-1.dim_600x700.jpg",
    description:
      "The hoodie that hits different. Heavy GSM fleece with embroidered branding and kangaroo pocket.",
  },
  {
    id: "s4",
    name: "YUG Zip Hoodie",
    priceCents: 5499,
    category: "hoodie",
    featured: false,
    imageUrl: "/assets/generated/hoodie-2.dim_600x700.jpg",
    description:
      "Street-ready zip-up with neon accents on the reverse. Full YKK zip and ribbed hem.",
  },
  {
    id: "s5",
    name: "SPARK STORE Cap",
    priceCents: 1899,
    category: "accessories",
    featured: false,
    imageUrl: "/assets/generated/accessories-1.dim_600x700.jpg",
    description:
      "Cap the fit off right. Adjustable snapback with embroidered SPARK STORE branding.",
  },
  {
    id: "s6",
    name: "Energy Tote Bag",
    priceCents: 1499,
    category: "accessories",
    featured: false,
    imageUrl: "/assets/generated/accessories-1.dim_600x700.jpg",
    description:
      "Carry the energy everywhere. Heavy canvas tote with screen-printed SPARK STORE logo.",
  },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];
const CATEGORY_LABELS: Record<string, string> = {
  tshirt: "T-Shirt",
  hoodie: "Hoodie",
  accessories: "Accessory",
};

export default function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-3xl font-black mb-4"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Product Not Found
          </h2>
          <Button
            onClick={() =>
              void navigate({ to: "/shop", search: { category: undefined } })
            }
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      priceCents: product.priceCents,
      size: selectedSize,
      quantity,
      imageUrl: product.imageUrl,
    });
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <button
          type="button"
          onClick={() =>
            void navigate({ to: "/shop", search: { category: undefined } })
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-purple-600 text-white border-0">
                Featured
              </Badge>
            )}
          </div>

          <div className="flex flex-col py-4">
            <Badge
              variant="outline"
              className="w-fit mb-4 border-purple-600/50 text-purple-400"
            >
              {CATEGORY_LABELS[product.category]}
            </Badge>
            <h1
              className="text-5xl font-black mb-4"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              {product.name}
            </h1>
            <p className="text-3xl font-black text-purple-400 mb-6">
              ${(product.priceCents / 100).toFixed(2)}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-sm font-semibold mb-3 uppercase tracking-widest text-muted-foreground">
                Select Size
              </p>
              <div
                className="flex gap-2 flex-wrap"
                data-ocid="product.size_select"
              >
                {SIZES.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "border-purple-600 bg-purple-600 text-white glow-border"
                        : "border-border hover:border-purple-600 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold mb-3 uppercase tracking-widest text-muted-foreground">
                Quantity
              </p>
              <div
                className="flex items-center gap-3"
                data-ocid="product.quantity_input"
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-xl font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <Button
              data-ocid="product.add_button"
              size="lg"
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg glow-border"
            >
              <ShoppingBag size={20} className="mr-2" /> Add to Cart
            </Button>

            <div className="mt-6 border border-border rounded-xl p-4 text-sm text-muted-foreground space-y-1">
              <p>&#9889; Free shipping on orders over $50</p>
              <p>&#128260; Easy 30-day returns</p>
              <p>&#128230; Ships within 2-3 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
