"use client";

import PageContainer from "@/components/layout/page-container";
import { Tasks } from "@/features/examples/tasks";

export default function TasksPage() {
  return (
    <PageContainer pageTitle="Tasks" pageDescription="Task boards and activity">
      <Tasks />
    </PageContainer>
  );
}
