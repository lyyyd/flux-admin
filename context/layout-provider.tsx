"use client";

import * as React from "react";

export type Variant = "inset" | "floating" | "sidebar";
export type Collapsible = "icon" | "offcanvas" | "none";
export type SidebarMode = "dark" | "light";

interface LayoutProviderProps {
  children: React.ReactNode;
  defaultVariant?: Variant;
  defaultCollapsible?: Collapsible;
  defaultSidebarMode?: SidebarMode;
  storageKey?: string;
  forcedSidebarMode?: SidebarMode;
}

interface LayoutProviderState {
  variant: Variant;
  defaultVariant: Variant;
  setVariant: (variant: Variant) => void;
  collapsible: Collapsible;
  defaultCollapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;
  sidebarMode: SidebarMode;
  defaultSidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  resetLayout: () => void;
}

const LayoutProviderContext = React.createContext<
  LayoutProviderState | undefined
>(undefined);

export function LayoutProvider({
  children,
  defaultVariant = "floating",
  defaultCollapsible = "offcanvas",
  defaultSidebarMode = "dark",
  storageKey = "sidebar-layout",
  forcedSidebarMode,
  ...props
}: LayoutProviderProps) {
  const [variant, setVariantState] = React.useState<Variant>(defaultVariant);
  const [collapsible, setCollapsibleState] =
    React.useState<Collapsible>(defaultCollapsible);
  const [sidebarModePref, setSidebarModePref] =
    React.useState<SidebarMode>(defaultSidebarMode);

  const persistPreference = React.useCallback(
    (suffix: string, value: string) => {
      if (typeof document === "undefined") return;
      const key = `${storageKey}-${suffix}`;
      document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
      try {
        localStorage.setItem(key, value);
      } catch {
        /* noop */
      }
    },
    [storageKey]
  );

  const setVariant = React.useCallback(
    (newVariant: Variant) => {
      setVariantState(newVariant);
      persistPreference("variant", newVariant);
    },
    [persistPreference]
  );

  const setCollapsible = React.useCallback(
    (newCollapsible: Collapsible) => {
      setCollapsibleState(newCollapsible);
      persistPreference("collapsible", newCollapsible);
    },
    [persistPreference]
  );

  const setSidebarMode = React.useCallback(
    (mode: SidebarMode) => {
      setSidebarModePref(mode);
      persistPreference("sidebar-mode", mode);
    },
    [persistPreference]
  );

  const effectiveSidebarMode = forcedSidebarMode ?? sidebarModePref;

  const resetLayout = React.useCallback(() => {
    setVariant(defaultVariant);
    setCollapsible(defaultCollapsible);
    setSidebarMode(defaultSidebarMode);
  }, [
    defaultVariant,
    defaultCollapsible,
    defaultSidebarMode,
    setVariant,
    setCollapsible,
    setSidebarMode
  ]);

  const value = React.useMemo(
    () => ({
      variant,
      defaultVariant,
      setVariant,
      collapsible,
      defaultCollapsible,
      setCollapsible,
      sidebarMode: effectiveSidebarMode,
      defaultSidebarMode,
      setSidebarMode,
      resetLayout
    }),
    [
      variant,
      defaultVariant,
      setVariant,
      collapsible,
      defaultCollapsible,
      setCollapsible,
      effectiveSidebarMode,
      defaultSidebarMode,
      setSidebarMode,
      resetLayout
    ]
  );

  return (
    <LayoutProviderContext.Provider {...props} value={value}>
      {children}
    </LayoutProviderContext.Provider>
  );
}

export const useLayout = () => {
  const context = React.useContext(LayoutProviderContext);

  if (context === undefined)
    throw new Error("useLayout must be used within a LayoutProvider");

  return context;
};
