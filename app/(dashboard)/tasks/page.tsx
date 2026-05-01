'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskTable } from "@/components/task-table";
import api from '@/lib/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignedTo: { name: string; email: string; role: string };
  project: { _id: string; title: string; description: string };
}

interface Project {
  _id: string;
  title: string;
  description: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects')
        ]);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCreateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/tasks', {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        project,
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setDueDate('');
      setProject('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      const response = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            View and manage all tasks across projects
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to a project.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="project">Project</Label>
                <Select value={project} onValueChange={setProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((proj) => (
                      <SelectItem key={proj._id} value={proj._id}>
                        {proj.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <TaskTable tasks={tasks} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
}
