import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ServiceRequestDetail } from "@/components/service/service-request-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Service Request Details - NexFlow CRM",
}

export default function ServiceRequestDetailPage({ params }: { params: { id: string } }) {
  if (params.id === "new") {
    return null
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/service">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Request Details</h1>
            <p className="text-muted-foreground">View and manage service request</p>
          </div>
        </div>

        <ServiceRequestDetail serviceRequestId={params.id} />
      </div>
    </DashboardShell>
  )
}
