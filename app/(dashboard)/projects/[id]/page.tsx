import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskTable } from "@/components/task-table";
import { getProjectById, getTasksByProjectId } from "@/lib/data";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const projectTasks = getTasksByProjectId(id);
  const todoCount = projectTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = projectTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneCount = projectTasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back to projects</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{project.progress}%</div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Todo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{doneCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        {projectTasks.length > 0 ? (
          <TaskTable tasks={projectTasks} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No tasks yet</p>
              <Button className="mt-4">
                <Plus className="mr-2 size-4" />
                Add your first task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
