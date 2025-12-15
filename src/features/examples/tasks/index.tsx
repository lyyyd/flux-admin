import { TasksDialogs } from "./components/tasks-dialogs";
import { TasksPrimaryButtons } from "./components/tasks-primary-buttons";
import { TasksProvider } from "./components/tasks-provider";
import { TasksTable } from "./components/tasks-table";
import { tasks } from "./data/tasks";

export function Tasks() {
  return (
    <TasksProvider>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <TasksTable data={tasks} />
      </div>
      <TasksDialogs />
    </TasksProvider>
  );
}
