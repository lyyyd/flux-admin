"use client";

import PageContainer from "@/components/layout/page-container";
import { SettingsDisplay } from "@/features/examples/settings/display";

export default function SettingsDisplayPage() {
  return (
    <PageContainer hideHeader scrollable={false}>
      <SettingsDisplay />
    </PageContainer>
  );
}
