"use client";

import PageContainer from "@/components/layout/page-container";
import { Users } from "@/features/examples/users";

export default function UsersPage() {
  return (
    <PageContainer pageTitle="Users" pageDescription="User management">
      <Users />
    </PageContainer>
  );
}
