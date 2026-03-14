import { Lock, Package, Settings, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const SAMPLE_ORDERS = [
  {
    id: "ord_001",
    customer: "User #1",
    items: 2,
    total: 7498,
    status: "pending",
    date: "2025-03-01",
  },
  {
    id: "ord_002",
    customer: "User #2",
    items: 1,
    total: 4999,
    status: "shipped",
    date: "2025-03-02",
  },
  {
    id: "ord_003",
    customer: "User #3",
    items: 3,
    total: 12996,
    status: "delivered",
    date: "2025-03-03",
  },
];

const SAMPLE_ADMIN_PRODUCTS = [
  { name: "SPARK Classic Tee", category: "T-Shirt", price: 24.99 },
  { name: "SPARK Pullover Hoodie", category: "Hoodie", price: 49.99 },
  { name: "SPARK STORE Cap", category: "Accessory", price: 18.99 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

type Tab = "products" | "orders" | "settings";

export default function Admin() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [stripeKey, setStripeKey] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center bg-card border border-border rounded-2xl p-12 max-w-sm w-full">
          <Lock size={48} className="mx-auto mb-6 text-purple-400" />
          <h2
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Admin Access
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Login with Internet Identity to access the admin panel.
          </p>
          <Button
            onClick={login}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <h1
          className="text-5xl font-black mb-8"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          Admin <span className="neon-text">Dashboard</span>
        </h1>

        <div className="flex gap-2 mb-8 border-b border-border pb-4">
          {(["products", "orders", "settings"] as Tab[]).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab === "products" && (
                <Package size={14} className="inline mr-1" />
              )}
              {tab === "orders" && (
                <ShoppingBag size={14} className="inline mr-1" />
              )}
              {tab === "settings" && (
                <Settings size={14} className="inline mr-1" />
              )}
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div data-ocid="admin.product_list">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <Button
                data-ocid="admin.add_button"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                + Add Product
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="p-4 text-muted-foreground font-medium">
                      Product
                    </th>
                    <th className="p-4 text-muted-foreground font-medium">
                      Category
                    </th>
                    <th className="p-4 text-muted-foreground font-medium">
                      Price
                    </th>
                    <th className="p-4 text-muted-foreground font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ADMIN_PRODUCTS.map((p) => (
                    <tr
                      key={p.name}
                      className="border-b border-border last:border-0 hover:bg-secondary/50"
                    >
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-muted-foreground">
                        {p.category}
                      </td>
                      <td className="p-4 text-purple-400 font-bold">
                        ${p.price}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-ocid="admin.save_button"
                            className="border-border text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            <div className="space-y-4">
              {SAMPLE_ORDERS.map((order, i) => (
                <div
                  key={order.id}
                  data-ocid={`admin.order.item.${i + 1}`}
                  className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 flex-wrap"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} &bull; {order.date} &bull; {order.items}{" "}
                      items
                    </p>
                  </div>
                  <p className="font-black text-purple-400">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                  <Badge
                    className={`border text-xs ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-xs"
                  >
                    Update Status
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Stripe Configuration</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label
                  htmlFor="stripe-key"
                  className="text-sm font-medium mb-2 block text-muted-foreground"
                >
                  Stripe Secret Key
                </label>
                <Input
                  id="stripe-key"
                  type="password"
                  placeholder="sk_live_..."
                  value={stripeKey}
                  onChange={(e) => setStripeKey(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <Button
                data-ocid="admin.save_button"
                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              >
                Save Configuration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
