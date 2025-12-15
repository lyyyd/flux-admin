"use client";

import PageContainer from "@/components/layout/page-container";
import { Chats } from "@/features/examples/chats";

export default function ChatsPage() {
  return (
    <PageContainer pageTitle="Chats" pageDescription="Conversations overview">
      <Chats />
    </PageContainer>
  );
}
