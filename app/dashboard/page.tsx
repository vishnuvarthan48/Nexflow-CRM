import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingVisits } from "@/components/dashboard/upcoming-visits"
import { PendingApprovals } from "@/components/dashboard/pending-approvals"
import { LeadsPipeline } from "@/components/dashboard/leads-pipeline"
import { QuickActions } from "@/components/dashboard/quick-actions"

export const metadata = {
  title: "Nexflow CRM",
  description: "Sales and service management dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        <DashboardStats />

        <QuickActions />

        <div className="grid gap-6 lg:grid-cols-2">
          <LeadsPipeline />
          <UpcomingVisits />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PendingApprovals />
          <RecentActivity />
        </div>
      </div>
    </DashboardShell>
  )
}
