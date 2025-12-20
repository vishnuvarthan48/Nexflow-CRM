import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LeadDetail } from "@/components/leads/lead-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Lead Details - MedEquip CRM",
}

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Details</h1>
            <p className="text-muted-foreground">View and manage lead information</p>
          </div>
        </div>

        <LeadDetail leadId={params.id} />
      </div>
    </DashboardShell>
  )
}
