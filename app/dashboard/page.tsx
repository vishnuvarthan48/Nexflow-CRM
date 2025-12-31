import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { LeadFunnelChart } from "@/components/dashboard/lead-funnel-chart"
import { FollowUpRisk } from "@/components/dashboard/follow-up-risk"
import { VisitActivityOverview } from "@/components/dashboard/visit-activity-overview"
import { TaskOverview } from "@/components/dashboard/task-overview"
import { PerformanceSnapshot } from "@/components/dashboard/performance-snapshot"

export const metadata = {
  title: "Dashboard - NexFlow CRM",
  description: "Sales and service management dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Command center for sales and field operations</p>
        </div>

        {/* ROW 1: KPI Strip - Fixed at top, always visible */}
        <KPICards />

        {/* ROW 2: Funnel (60%) + Follow-up Risk (40%) */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <LeadFunnelChart />
          </div>
          <div className="lg:col-span-2">
            <FollowUpRisk />
          </div>
        </div>

        {/* ROW 3: Visit Calendar (50%) + Task Summary (50%) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <VisitActivityOverview />
          <TaskOverview />
        </div>

        {/* ROW 4: Performance Snapshot */}
        <PerformanceSnapshot />
      </div>
    </DashboardShell>
  )
}
