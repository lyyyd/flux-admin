"use client";

import * as React from "react";

export type Direction = "ltr" | "rtl";

interface DirectionProviderProps {
  children: React.ReactNode;
  defaultDir?: Direction;
  storageKey?: string;
}

interface DirectionProviderState {
  dir: Direction;
  defaultDir: Direction;
  setDir: (dir: Direction) => void;
  resetDir: () => void;
}

const DirectionProviderContext = React.createContext<
  DirectionProviderState | undefined
>(undefined);

export function DirectionProvider({
  children,
  defaultDir = "ltr",
  storageKey = "direction",
  ...props
}: DirectionProviderProps) {
  const [dir, setDirectionState] = React.useState<Direction>(defaultDir);

  const persistDirection = React.useCallback(
    (nextDir: Direction) => {
      if (typeof document === "undefined") return;
      document.cookie = `${storageKey}=${nextDir}; path=/; max-age=31536000; SameSite=Lax`;
      try {
        localStorage.setItem(storageKey, nextDir);
      } catch {
        /* noop */
      }
    },
    [storageKey]
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("dir", dir);
  }, [dir]);

  const setDir = React.useCallback(
    (newDir: Direction) => {
      setDirectionState(newDir);
      persistDirection(newDir);
    },
    [persistDirection]
  );

  const resetDir = React.useCallback(() => {
    setDir(defaultDir);
  }, [defaultDir, setDir]);

  const value = React.useMemo(
    () => ({
      dir,
      defaultDir,
      setDir,
      resetDir
    }),
    [dir, defaultDir, setDir, resetDir]
  );

  return (
    <DirectionProviderContext.Provider {...props} value={value}>
      {children}
    </DirectionProviderContext.Provider>
  );
}

export const useDirection = () => {
  const context = React.useContext(DirectionProviderContext);

  if (context === undefined)
    throw new Error("useDirection must be used within a DirectionProvider");

  return context;
};
