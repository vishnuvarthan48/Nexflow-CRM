import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LeadsList } from "@/components/leads/leads-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Leads - NexFlow CRM",
  description: "Manage your sales leads",
}

export default function LeadsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">Manage and track your sales leads</p>
          </div>
          <Link href="/dashboard/leads/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Lead
            </Button>
          </Link>
        </div>

        <LeadsList />
      </div>
    </DashboardShell>
  )
}
