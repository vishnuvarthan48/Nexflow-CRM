import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ServiceRequestFormWrapper } from "@/components/service/service-request-form-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Edit Service Request - MedEquip CRM",
}

export default function EditServiceRequestPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/service/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Service Request</h1>
            <p className="text-muted-foreground">Update service request information</p>
          </div>
        </div>

        <ServiceRequestFormWrapper serviceRequestId={params.id} />
      </div>
    </DashboardShell>
  )
}
