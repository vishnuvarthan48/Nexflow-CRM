import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ServiceRequestsList } from "@/components/service/service-requests-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Service Requests - MedEquip CRM",
  description: "Manage service requests",
}

export default function ServicePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
            <p className="text-muted-foreground">Manage customer service requests</p>
          </div>
          <Link href="/dashboard/service/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Service Request
            </Button>
          </Link>
        </div>

        <ServiceRequestsList />
      </div>
    </DashboardShell>
  )
}
