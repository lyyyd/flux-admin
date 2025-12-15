"use client";

import PageContainer from "@/components/layout/page-container";
import { ComingSoon } from "@/components/coming-soon";

export default function HelpCenterPage() {
  return (
    <PageContainer pageTitle="Help Center" pageDescription="Support resources">
      <ComingSoon />
    </PageContainer>
  );
}
