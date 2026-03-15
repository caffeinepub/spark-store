import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export interface StoreSettings {
  upiId: string;
  deliveryPhone: string;
  whatsappNumber: string;
  qrCodeUrl: string;
  storeName: string;
  instagramHandle: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  upiId: "8780034074@fam",
  deliveryPhone: "8780034074",
  whatsappNumber: "918780034074",
  qrCodeUrl: "/assets/generated/upi-qr-code.dim_400x450.png",
  storeName: "SPARK STORE",
  instagramHandle: "@sparkstore",
};

const STORAGE_KEY = "spark_store_settings";

function loadSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw)
      return {
        ...DEFAULT_SETTINGS,
        ...(JSON.parse(raw) as Partial<StoreSettings>),
      };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(s: StoreSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | null>(
  null,
);

export function StoreSettingsProvider({
  children,
}: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (patch: Partial<StoreSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  return (
    <StoreSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx)
    throw new Error(
      "useStoreSettings must be used within StoreSettingsProvider",
    );
  return ctx;
}
