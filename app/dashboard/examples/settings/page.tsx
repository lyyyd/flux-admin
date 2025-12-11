"use client";

import PageContainer from "@/components/layout/page-container";
import { SettingsProfile } from "@/features/examples/settings/profile";

export default function SettingsProfilePage() {
  return (
    <PageContainer hideHeader scrollable={false}>
      <SettingsProfile />
    </PageContainer>
  );
}
