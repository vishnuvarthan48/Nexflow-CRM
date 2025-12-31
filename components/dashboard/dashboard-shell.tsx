"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
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
  Server,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BreadcrumbNavigation } from "./breadcrumb-navigation"

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
  { name: "Tenants", href: "/dashboard/tenants", icon: Server }, // Added Tenants navigation
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebar pathname={pathname} onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <aside className="hidden w-60 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white font-bold text-base shadow-lg">
                N
              </div>
              <span className="text-base font-semibold text-sidebar-foreground">NexFlow CRM</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10 text-sm font-medium rounded-lg",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 h-9 px-4 shadow-sm bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/leads/new")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>New Lead</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/visits/schedule")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>New Visit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/tasks")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>New Task</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/quotations/new")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>New Quotation</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/service/new")}>
                  <Wrench className="mr-2 h-4 w-4" />
                  <span>New Service Request</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              PS
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <BreadcrumbNavigation />
          {children}
        </main>
      </div>
    </div>
  )
}

function MobileSidebar({ pathname, onClose }: { pathname: string | null; onClose: () => void }) {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white font-bold text-sm shadow-lg">
            N
          </div>
          <span className="font-semibold text-sidebar-foreground">NexFlow CRM</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-sidebar-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-3 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/leads/new")
                onClose()
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>New Lead</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/visits/schedule")
                onClose()
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>New Visit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/tasks")
                onClose()
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>New Task</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/quotations/new")
                onClose()
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>New Quotation</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/service/new")
                onClose()
              }}
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>New Service Request</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 text-sm font-medium rounded-lg",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
