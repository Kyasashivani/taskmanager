import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignedTo: { name: string; email: string; role: string };
  project: { _id: string; title: string; description: string };
}

interface TaskTableProps {
  tasks: Task[];
  onStatusUpdate: (taskId: string, status: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  Pending: {
    label: "Pending",
    className: "bg-secondary text-secondary-foreground",
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary",
  },
  Completed: {
    label: "Completed",
    className: "bg-success/10 text-success",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateString: string) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TaskTable({ tasks, onStatusUpdate }: TaskTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const config = statusConfig[task.status];
            return (
              <TableRow key={task._id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(value) => onStatusUpdate(task._id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px] bg-secondary">
                        {getInitials(task.assignedTo?.name || 'Unassigned')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{task.project.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(task.dueDate)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
