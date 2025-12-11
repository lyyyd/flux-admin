"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import { fonts } from "@/config/fonts";

const DEFAULT_FONT = fonts[0];
const STORAGE_KEY = "ui-font";

export type Font = (typeof fonts)[number];

type FontContextValue = {
  font: Font;
  setFont: (font: Font) => void;
  resetFont: () => void;
};

const FontContext = createContext<FontContextValue | null>(null);

export function FontProvider({ children }: { children: ReactNode }) {
  const [font, setFontState] = useState<Font>(() => {
    if (typeof window === "undefined") return DEFAULT_FONT;

    const stored = window.localStorage.getItem(STORAGE_KEY) as Font | null;
    return stored && fonts.includes(stored) ? stored : DEFAULT_FONT;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    root.classList.forEach((cls) => {
      if (cls.startsWith("font-")) {
        root.classList.remove(cls);
      }
    });

    root.classList.add(`font-${font}`);
    window.localStorage.setItem(STORAGE_KEY, font);
  }, [font]);

  const setFont = (nextFont: Font) => setFontState(nextFont);
  const resetFont = () => setFontState(DEFAULT_FONT);

  return (
    <FontContext.Provider value={{ font, setFont, resetFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);

  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }

  return context;
}
