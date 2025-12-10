"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";
import { ActiveThemeProvider } from "../active-theme";
import { DirectionProvider } from "@/context/direction-provider";
import {
  type Collapsible,
  type SidebarMode,
  type Variant,
  LayoutProvider
} from "@/context/layout-provider";

interface ProvidersProps {
  activeThemeValue?: string;
  initialLayout?: {
    variant?: Variant;
    collapsible?: Collapsible;
    sidebarMode?: SidebarMode;
  };
  initialDir?: "ltr" | "rtl";
  children: React.ReactNode;
}

export default function Providers({
  activeThemeValue,
  initialLayout,
  initialDir,
  children
}: ProvidersProps) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  const variant = initialLayout?.variant ?? "floating";
  const collapsible = initialLayout?.collapsible ?? "offcanvas";
  const sidebarMode = initialLayout?.sidebarMode ?? "dark";
  const direction = initialDir ?? "ltr";
  const forcedSidebarMode = resolvedTheme === "dark" ? "dark" : undefined;

  return (
    <>
      <DirectionProvider defaultDir={direction}>
        <LayoutProvider
          defaultVariant={variant}
          defaultCollapsible={collapsible}
          defaultSidebarMode={sidebarMode}
          forcedSidebarMode={forcedSidebarMode}
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <ClerkProvider
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined
              }}
            >
              {children}
            </ClerkProvider>
          </ActiveThemeProvider>
        </LayoutProvider>
      </DirectionProvider>
    </>
  );
}
