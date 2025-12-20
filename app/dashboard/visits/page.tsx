import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VisitsList } from "@/components/visits/visits-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Visits - MedEquip CRM",
  description: "Manage visit schedules",
}

export default function VisitsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Visits</h1>
            <p className="text-muted-foreground">Schedule and manage customer visits</p>
          </div>
          <Link href="/dashboard/visits/schedule">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Visit
            </Button>
          </Link>
        </div>

        <VisitsList />
      </div>
    </DashboardShell>
  )
}
