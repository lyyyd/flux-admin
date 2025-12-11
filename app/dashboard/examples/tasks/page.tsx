"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const taskData = [
  {
    id: 1,
    title: "Review pull requests",
    status: "todo",
    priority: "high",
    dueDate: "2025-12-12"
  },
  {
    id: 2,
    title: "Update documentation",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-12-15"
  },
  {
    id: 3,
    title: "Fix navigation bug",
    status: "done",
    priority: "high",
    dueDate: "2025-12-10"
  },
  {
    id: 4,
    title: "Design new feature",
    status: "todo",
    priority: "low",
    dueDate: "2025-12-20"
  },
  {
    id: 5,
    title: "Write unit tests",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-12-13"
  },
  {
    id: 6,
    title: "Deploy to production",
    status: "done",
    priority: "high",
    dueDate: "2025-12-09"
  },
  {
    id: 7,
    title: "Refactor API endpoints",
    status: "todo",
    priority: "medium",
    dueDate: "2025-12-18"
  },
  {
    id: 8,
    title: "Update dependencies",
    status: "done",
    priority: "low",
    dueDate: "2025-12-08"
  }
];

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">(
    "all"
  );

  const filteredTasks =
    filter === "all"
      ? taskData
      : taskData.filter((task) => task.status === filter);

  const todoCount = taskData.filter((t) => t.status === "todo").length;
  const inProgressCount = taskData.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneCount = taskData.filter((t) => t.status === "done").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="text-muted-foreground h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and track progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Circle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoCount}</div>
            <p className="text-muted-foreground text-xs">tasks pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-muted-foreground text-xs">tasks in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneCount}</div>
            <p className="text-muted-foreground text-xs">tasks completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(v) => setFilter(v as any)}
      >
        <TabsList>
          <TabsTrigger value="all">All Tasks ({taskData.length})</TabsTrigger>
          <TabsTrigger value="todo">To Do ({todoCount})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="done">Done ({doneCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4 space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <CardDescription>Due: {task.dueDate}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
