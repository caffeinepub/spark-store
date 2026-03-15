import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: { name: string; size: string; qty: number; priceCents: number }[];
  totalCents: number;
  discountedTotalCents: number;
  couponUsed: string | null;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address?: DeliveryAddress;
}

const STORAGE_KEY = "spark_orders";

function loadOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as OrderRecord[];
  } catch {
    // ignore
  }
  return [];
}

function persist(orders: OrderRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

interface OrdersContextType {
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, "id" | "date" | "status">) => string;
  updateStatus: (id: string, status: OrderRecord["status"]) => void;
  deleteOrder: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrderRecord[]>(loadOrders);

  const addOrder = useCallback(
    (order: Omit<OrderRecord, "id" | "date" | "status">) => {
      const id = `ORD-${Date.now()}`;
      const record: OrderRecord = {
        ...order,
        id,
        date: new Date().toLocaleDateString("en-IN"),
        status: "pending",
      };
      setOrders((prev) => {
        const next = [record, ...prev];
        persist(next);
        return next;
      });
      return id;
    },
    [],
  );

  const updateStatus = useCallback(
    (id: string, status: OrderRecord["status"]) => {
      setOrders((prev) => {
        const next = prev.map((o) => (o.id === id ? { ...o, status } : o));
        persist(next);
        return next;
      });
    },
    [],
  );

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => {
      const next = prev.filter((o) => o.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateStatus, deleteOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
