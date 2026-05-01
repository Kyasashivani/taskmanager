'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { getToken } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
