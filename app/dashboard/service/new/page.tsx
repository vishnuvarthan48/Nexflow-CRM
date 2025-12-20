import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ServiceRequestForm } from "@/components/service/service-request-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "New Service Request - MedEquip CRM",
}

export default function NewServiceRequestPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">New Service Request</h1>
            <p className="text-muted-foreground">Create a service request</p>
          </div>
        </div>

        <ServiceRequestForm />
      </div>
    </DashboardShell>
  )
}
