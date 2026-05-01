'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from '@/lib/api';

const iconMap = {
  totalTasks: ListTodo,
  completedTasks: CheckCircle2,
  overdueTasks: Clock,
  pendingTasks: Clock,
  inProgressTasks: FolderKanban,
};

const labelMap = {
  totalTasks: "Total Tasks",
  completedTasks: "Completed",
  overdueTasks: "Overdue",
  pendingTasks: "Pending",
  inProgressTasks: "In Progress",
};

const colorMap = {
  totalTasks: "text-primary",
  completedTasks: "text-success",
  overdueTasks: "text-destructive",
  pendingTasks: "text-warning",
  inProgressTasks: "text-chart-3",
};

export function StatsCards() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/tasks/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {(Object.keys(stats) as Array<keyof typeof stats>).map((key) => {
        const Icon = iconMap[key];
        return (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {labelMap[key]}
              </CardTitle>
              <Icon className={`size-4 ${colorMap[key]}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats[key]}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
