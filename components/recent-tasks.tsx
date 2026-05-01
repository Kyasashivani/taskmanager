import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { tasks, users } from "@/lib/data";
import type { TaskStatus } from "@/lib/data";

const statusConfig: Record<
  TaskStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  todo: { label: "Todo", variant: "outline" },
  "in-progress": { label: "In Progress", variant: "secondary" },
  done: { label: "Done", variant: "default" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function RecentTasks() {
  const recentTasks = tasks.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Latest task updates</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks" className="flex items-center gap-1">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks.map((task) => {
            const user = users.find((u) => u.name === task.assignee);
            const config = statusConfig[task.status];
            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs bg-secondary">
                      {user?.avatar || getInitials(task.assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{task.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.assignee}
                    </p>
                  </div>
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
