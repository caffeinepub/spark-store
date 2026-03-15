import {
  CheckCircle,
  Lock,
  Package,
  RefreshCw,
  Save,
  Settings,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { type OrderRecord, useOrders } from "../context/OrdersContext";
import { useStoreSettings } from "../context/StoreSettingsContext";

const ADMIN_PASSWORD = "spark123";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const ALL_STATUSES: OrderRecord["status"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

type Tab = "orders" | "settings";

function SettingField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  id,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  id?: string;
}) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="text-sm font-semibold mb-1 block text-purple-300"
      >
        {label}
      </label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      <Input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#0a0a1a] border-[#2d1b69] text-white placeholder:text-white/30 focus:border-purple-500"
      />
    </div>
  );
}

function buildWhatsAppMessage(
  status: OrderRecord["status"],
  customerName: string,
  orderId: string,
  storeName: string,
): string | null {
  const name = customerName || "Customer";
  switch (status) {
    case "processing":
      return `Hi ${name}! ⚡ Your ${storeName} order ${orderId} is now being processed. We'll notify you once it ships!`;
    case "shipped":
      return `Hi ${name}! 🚀 Your ${storeName} order ${orderId} has been shipped! It's on its way to you. Stay tuned for delivery!`;
    case "delivered":
      return `Hi ${name}! 🎉 Your ${storeName} order ${orderId} has been delivered! Thank you for shopping with us. We hope you love it! 💜`;
    case "cancelled":
      return `Hi ${name}! 😔 Your ${storeName} order ${orderId} has been cancelled. If you have any questions, please reach out to us. Sorry for the inconvenience.`;
    default:
      return null;
  }
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(
    new Set(),
  );

  const { orders, updateStatus, deleteOrder } = useOrders();
  const { settings, updateSettings, resetSettings } = useStoreSettings();

  // local draft of settings
  const [draft, setDraft] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Try again.");
    }
  };

  const handleSave = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetSettings();
    setDraft({ ...settings });
  };

  const handleStatusChange = (
    order: OrderRecord,
    newStatus: OrderRecord["status"],
  ) => {
    updateStatus(order.id, newStatus);

    const phone = order.address?.phone;
    if (!phone) return;

    const message = buildWhatsAppMessage(
      newStatus,
      order.address?.fullName ?? "Customer",
      order.id,
      settings.storeName || "SPARK STORE",
    );
    if (!message) return;

    const digits = phone.replace(/\D/g, "");
    const waPhone = `91${digits}`;
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setSentNotifications((prev) => new Set(prev).add(order.id));
    setTimeout(() => {
      setSentNotifications((prev) => {
        const next = new Set(prev);
        next.delete(order.id);
        return next;
      });
    }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div
          className="text-center rounded-2xl p-12 max-w-sm w-full"
          style={{ background: "#0d0d1a", border: "1px solid #2d1b69" }}
        >
          <Lock size={48} className="mx-auto mb-6 text-purple-400" />
          <h2
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Admin Access
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Enter your admin password to access the dashboard.
          </p>
          <input
            data-ocid="admin.password_input"
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-3 text-white"
            style={{
              background: "#0a0a1a",
              border: `1px solid ${passwordError ? "#ef4444" : "#2d1b69"}`,
            }}
          />
          {passwordError && (
            <p className="text-red-400 text-xs mb-3">{passwordError}</p>
          )}
          <Button
            data-ocid="admin.login_button"
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Login
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
      <div className="max-w-6xl mx-auto py-8">
        <h1
          className="text-5xl font-black mb-8"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          Admin{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Dashboard
          </span>
        </h1>

        {/* Tabs */}
        <div
          className="flex gap-2 mb-8 border-b pb-4"
          style={{ borderColor: "#1e1e1e" }}
        >
          {(
            [
              { key: "orders", icon: ShoppingBag, label: "Orders" },
              { key: "settings", icon: Settings, label: "Settings" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              type="button"
              key={key}
              data-ocid={`admin.${key}.tab`}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ─── ORDERS TAB ─── */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                All Orders{" "}
                <span className="text-muted-foreground text-base font-normal ml-2">
                  ({orders.length})
                </span>
              </h2>
            </div>

            {orders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="rounded-2xl p-12 text-center"
                style={{ background: "#0d0d1a", border: "1px dashed #2d1b69" }}
              >
                <ShoppingBag
                  size={48}
                  className="mx-auto mb-4 text-purple-400 opacity-40"
                />
                <p className="text-muted-foreground">
                  No orders yet. Orders will appear here once customers complete
                  a purchase.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => (
                  <div
                    key={order.id}
                    data-ocid={`admin.order.item.${i + 1}`}
                    className="rounded-2xl p-5"
                    style={{
                      background: "#0d0d1a",
                      border: "1px solid #1e1e1e",
                    }}
                  >
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <p className="font-black text-purple-300 tracking-wider">
                            {order.id}
                          </p>
                          <Badge
                            className={`border text-xs ${STATUS_COLORS[order.status]}`}
                          >
                            {order.status}
                          </Badge>
                          {order.couponUsed && (
                            <span className="text-xs text-green-400 font-semibold">
                              Coupon: {order.couponUsed}
                            </span>
                          )}
                          {sentNotifications.has(order.id) && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(37,211,102,0.15)",
                                color: "#25d366",
                                border: "1px solid rgba(37,211,102,0.3)",
                              }}
                            >
                              ✅ WhatsApp sent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {order.date} &bull;{" "}
                          {order.items.reduce((s, it) => s + it.qty, 0)} item(s)
                        </p>

                        {/* Delivery address */}
                        {order.address && (
                          <div
                            className="rounded-lg px-3 py-2 mb-3 text-xs"
                            style={{
                              background: "rgba(124,58,237,0.07)",
                              border: "1px solid #2d1b69",
                            }}
                          >
                            <p className="font-bold text-purple-300 mb-0.5">
                              {order.address.fullName} &bull;{" "}
                              {order.address.phone}
                            </p>
                            <p className="text-muted-foreground">
                              {order.address.addressLine}, {order.address.city},{" "}
                              {order.address.state} — {order.address.pincode}
                            </p>
                          </div>
                        )}

                        {/* Items list */}
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div
                              key={`${item.name}-${item.size}`}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-white/80">
                                {item.name}{" "}
                                <span className="text-muted-foreground">
                                  × {item.qty} (Size: {item.size})
                                </span>
                              </span>
                              <span className="text-purple-400 font-semibold">
                                ₹
                                {((item.priceCents * item.qty) / 100).toFixed(
                                  0,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: total + actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Total Paid
                          </p>
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            ₹{(order.discountedTotalCents / 100).toFixed(0)}
                          </p>
                          {order.discountedTotalCents < order.totalCents && (
                            <p className="text-xs text-muted-foreground line-through">
                              ₹{(order.totalCents / 100).toFixed(0)}
                            </p>
                          )}
                        </div>

                        {/* Status updater */}
                        <div className="flex flex-col items-end gap-1">
                          <select
                            data-ocid={`admin.order.status.${i + 1}`}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order,
                                e.target.value as OrderRecord["status"],
                              )
                            }
                            className="text-xs rounded-lg px-3 py-2 font-semibold outline-none cursor-pointer"
                            style={{
                              background: "#1a0f2e",
                              border: "1px solid #2d1b69",
                              color: "#a78bfa",
                            }}
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          {order.address?.phone && (
                            <p className="text-xs" style={{ color: "#25d366" }}>
                              📱 Customer will be notified
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          data-ocid={`admin.order.delete_button.${i + 1}`}
                          onClick={() => deleteOrder(order.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            {/* Payment Settings */}
            <section
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#0d0d1a", border: "1px solid #2d1b69" }}
            >
              <h3 className="text-lg font-black text-purple-300 uppercase tracking-wider">
                💳 Payment Settings
              </h3>

              <SettingField
                label="UPI ID"
                hint="Shown to customers during checkout (e.g. 9876543210@paytm)"
                value={draft.upiId}
                onChange={(v) => setDraft((d) => ({ ...d, upiId: v }))}
                placeholder="yourname@bank"
              />

              <div>
                <label
                  htmlFor="qr-code-url"
                  className="text-sm font-semibold mb-1 block text-purple-300"
                >
                  QR Code Image URL
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Paste a direct image URL (e.g. https://...) or an uploaded
                  path. This QR code is shown at checkout.
                </p>
                <Input
                  type="url"
                  value={draft.qrCodeUrl}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, qrCodeUrl: e.target.value }))
                  }
                  id="qr-code-url"
                  placeholder="https://your-site.com/qr.png"
                  className="bg-[#0a0a1a] border-[#2d1b69] text-white placeholder:text-white/30 focus:border-purple-500 mb-3"
                />
                {draft.qrCodeUrl && (
                  <div
                    className="inline-block rounded-xl p-2"
                    style={{ background: "#fff" }}
                  >
                    <img
                      src={draft.qrCodeUrl}
                      alt="QR Preview"
                      className="w-36 h-auto rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Contact Settings */}
            <section
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#0d0d1a", border: "1px solid #1e1e1e" }}
            >
              <h3 className="text-lg font-black text-purple-300 uppercase tracking-wider">
                📞 Contact Settings
              </h3>

              <SettingField
                label="Delivery Phone Number"
                hint="Shown in the order confirmation popup (digits only)"
                value={draft.deliveryPhone}
                onChange={(v) => setDraft((d) => ({ ...d, deliveryPhone: v }))}
                placeholder="9876543210"
              />

              <SettingField
                label="WhatsApp Number (with country code)"
                hint="Used for the WhatsApp chat button, include country code, no + sign (e.g. 919876543210)"
                value={draft.whatsappNumber}
                onChange={(v) => setDraft((d) => ({ ...d, whatsappNumber: v }))}
                placeholder="919876543210"
              />
            </section>

            {/* Brand Settings */}
            <section
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#0d0d1a", border: "1px solid #1e1e1e" }}
            >
              <h3 className="text-lg font-black text-purple-300 uppercase tracking-wider">
                🔥 Brand Settings
              </h3>

              <SettingField
                label="Store Name"
                value={draft.storeName}
                onChange={(v) => setDraft((d) => ({ ...d, storeName: v }))}
                placeholder="SPARK STORE"
              />

              <SettingField
                label="Instagram Handle"
                hint="Shown in the post-purchase social card"
                value={draft.instagramHandle}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, instagramHandle: v }))
                }
                placeholder="@yourstore"
              />
            </section>

            {/* Save / Reset */}
            <div className="flex gap-3">
              <Button
                data-ocid="admin.settings.save_button"
                onClick={handleSave}
                className="flex-1 py-5 font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                }}
              >
                {saved ? (
                  <>
                    <CheckCircle size={16} className="mr-2" /> Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" /> Save All Settings
                  </>
                )}
              </Button>
              <Button
                data-ocid="admin.settings.reset_button"
                variant="outline"
                onClick={handleReset}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-5"
              >
                <RefreshCw size={14} className="mr-1" /> Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
