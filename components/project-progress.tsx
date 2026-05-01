import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/data";

export function ProjectProgress() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Overview of active projects</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects" className="flex items-center gap-1">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.slice(0, 4).map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href={`/projects/${project.id}`}
                className="text-sm font-medium hover:underline"
              >
                {project.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {project.completedTasks} of {project.tasksCount} tasks completed
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
