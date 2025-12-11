"use client";

import PageContainer from "@/components/layout/page-container";
import { SettingsAppearance } from "@/features/examples/settings/appearance";

export default function SettingsAppearancePage() {
  return (
    <PageContainer hideHeader scrollable={false}>
      <SettingsAppearance />
    </PageContainer>
  );
}
