"use client";

import PageContainer from "@/components/layout/page-container";
import { SettingsAccount } from "@/features/examples/settings/account";

export default function SettingsAccountPage() {
  return (
    <PageContainer hideHeader scrollable={false}>
      <SettingsAccount />
    </PageContainer>
  );
}
