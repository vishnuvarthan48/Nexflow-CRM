"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Microscope,
  Wrench,
  Menu,
  X,
  BarChart3,
  Building2,
  Package,
  CheckCircle2,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Visits", href: "/dashboard/visits", icon: Calendar },
  { name: "Quotations", href: "/dashboard/quotations", icon: FileText },
  { name: "Demos", href: "/dashboard/demos", icon: Microscope },
  { name: "Service", href: "/dashboard/service", icon: Wrench },
  { name: "Companies", href: "/dashboard/companies", icon: Building2 },
  { name: "Items/Services", href: "/dashboard/items-services", icon: Package },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckCircle2 },
  { name: "Workflow", href: "/dashboard/workflow", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebar
            pathname={pathname}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-bold">Nexflow CRM</h2>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            {/* Global quick actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Quick Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/leads/new")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>New Lead</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/visits/schedule")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>New Visit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/tasks")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>New Task</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/quotations/new")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>New Quotation</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/service/new")}
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  <span>New Service Request</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary" />
              <div className="hidden text-sm lg:block">
                <div className="font-medium">Priya Sharma</div>
                <div className="text-xs text-muted-foreground">
                  Sales Executive
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function MobileSidebar({
  pathname,
  onClose,
}: {
  pathname: string | null;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <h2 className="text-lg font-bold">MedEquip CRM</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      {/* Quick actions dropdown in mobile sidebar */}
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/leads/new");
                onClose();
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>New Lead</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/visits/schedule");
                onClose();
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>New Visit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/tasks");
                onClose();
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>New Task</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/quotations/new");
                onClose();
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>New Quotation</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/service/new");
                onClose();
              }}
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>New Service Request</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
