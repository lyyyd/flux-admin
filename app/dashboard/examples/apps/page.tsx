"use client";

import PageContainer from "@/components/layout/page-container";
import { Apps } from "@/features/examples/apps";

export default function AppsPage() {
  return (
    <PageContainer pageTitle="Apps" pageDescription="Manage your apps">
      <Apps />
    </PageContainer>
  );
}
