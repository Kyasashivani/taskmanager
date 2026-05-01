import { StatsCards } from "@/components/stats-cards";
import { ProjectProgress } from "@/components/project-progress";
import { RecentTasks } from "@/components/recent-tasks";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your team&apos;s progress.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectProgress />
        <RecentTasks />
      </div>
    </div>
  );
}
