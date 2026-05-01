export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasksCount: number;
  completedTasks: number;
}

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern UI/UX",
    progress: 75,
    tasksCount: 12,
    completedTasks: 9,
  },
  {
    id: "proj-2",
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    progress: 45,
    tasksCount: 20,
    completedTasks: 9,
  },
  {
    id: "proj-3",
    name: "API Integration",
    description: "Third-party API integrations for payment and analytics",
    progress: 90,
    tasksCount: 8,
    completedTasks: 7,
  },
  {
    id: "proj-4",
    name: "Marketing Campaign",
    description: "Q2 marketing campaign with social media focus",
    progress: 30,
    tasksCount: 15,
    completedTasks: 5,
  },
  {
    id: "proj-5",
    name: "Database Migration",
    description: "Migrate legacy database to PostgreSQL",
    progress: 60,
    tasksCount: 10,
    completedTasks: 6,
  },
];

export const tasks: Task[] = [
  // Website Redesign tasks
  {
    id: "task-1",
    name: "Design homepage mockup",
    status: "done",
    assignee: "Sarah Chen",
    dueDate: "2024-01-15",
    projectId: "proj-1",
  },
  {
    id: "task-2",
    name: "Implement responsive navbar",
    status: "done",
    assignee: "Alex Kim",
    dueDate: "2024-01-18",
    projectId: "proj-1",
  },
  {
    id: "task-3",
    name: "Create contact form",
    status: "in-progress",
    assignee: "Mike Johnson",
    dueDate: "2024-01-25",
    projectId: "proj-1",
  },
  {
    id: "task-4",
    name: "Optimize images",
    status: "todo",
    assignee: "Emily Davis",
    dueDate: "2024-01-30",
    projectId: "proj-1",
  },
  // Mobile App tasks
  {
    id: "task-5",
    name: "Setup React Native project",
    status: "done",
    assignee: "Alex Kim",
    dueDate: "2024-01-10",
    projectId: "proj-2",
  },
  {
    id: "task-6",
    name: "Design app navigation",
    status: "done",
    assignee: "Sarah Chen",
    dueDate: "2024-01-12",
    projectId: "proj-2",
  },
  {
    id: "task-7",
    name: "Implement authentication",
    status: "in-progress",
    assignee: "Mike Johnson",
    dueDate: "2024-01-28",
    projectId: "proj-2",
  },
  {
    id: "task-8",
    name: "Build dashboard screen",
    status: "todo",
    assignee: "Emily Davis",
    dueDate: "2024-02-05",
    projectId: "proj-2",
  },
  // API Integration tasks
  {
    id: "task-9",
    name: "Setup Stripe integration",
    status: "done",
    assignee: "Mike Johnson",
    dueDate: "2024-01-08",
    projectId: "proj-3",
  },
  {
    id: "task-10",
    name: "Implement webhook handlers",
    status: "in-progress",
    assignee: "Alex Kim",
    dueDate: "2024-01-20",
    projectId: "proj-3",
  },
  // Marketing Campaign tasks
  {
    id: "task-11",
    name: "Create content calendar",
    status: "done",
    assignee: "Emily Davis",
    dueDate: "2024-01-05",
    projectId: "proj-4",
  },
  {
    id: "task-12",
    name: "Design social media graphics",
    status: "in-progress",
    assignee: "Sarah Chen",
    dueDate: "2024-01-22",
    projectId: "proj-4",
  },
  // Database Migration tasks
  {
    id: "task-13",
    name: "Create database schema",
    status: "done",
    assignee: "Mike Johnson",
    dueDate: "2024-01-07",
    projectId: "proj-5",
  },
  {
    id: "task-14",
    name: "Write migration scripts",
    status: "in-progress",
    assignee: "Alex Kim",
    dueDate: "2024-01-25",
    projectId: "proj-5",
  },
];

export const users = [
  { id: "user-1", name: "Sarah Chen", avatar: "SC" },
  { id: "user-2", name: "Alex Kim", avatar: "AK" },
  { id: "user-3", name: "Mike Johnson", avatar: "MJ" },
  { id: "user-4", name: "Emily Davis", avatar: "ED" },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getTasksByProjectId(projectId: string): Task[] {
  return tasks.filter((t) => t.projectId === projectId);
}

export function getStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const overdueTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return dueDate < today && t.status !== "done";
  }).length;
  const activeProjects = projects.length;

  return {
    totalTasks,
    completedTasks,
    overdueTasks,
    activeProjects,
  };
}
