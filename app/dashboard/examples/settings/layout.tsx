"use client";

import type { ReactNode } from "react";
import { Settings } from "@/features/examples/settings";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <Settings>{children}</Settings>;
}
