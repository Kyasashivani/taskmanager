import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: { name: string; email: string; role: string };
  members: { name: string; email: string; role: string }[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Created by: {project.createdBy.name}
        </div>
        <div className="text-sm text-muted-foreground">
          Members: {project.members.length}
        </div>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Link href={`/projects/${project._id}`}>
              View
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
