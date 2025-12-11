"use client";

import PageContainer from "@/components/layout/page-container";
import type { ReactNode } from "react";
import { Settings } from "@/features/examples/settings";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer hideHeader scrollable={false}>
      <Settings>{children}</Settings>
    </PageContainer>
  );
}
