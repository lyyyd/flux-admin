"use client";

import PageContainer from "@/components/layout/page-container";
import { SettingsNotifications } from "@/features/examples/settings/notifications";

export default function SettingsNotificationsPage() {
  return (
    <PageContainer hideHeader scrollable={false}>
      <SettingsNotifications />
    </PageContainer>
  );
}
