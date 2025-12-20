import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VisitFormWrapper } from "@/components/visits/visit-form-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Edit Visit - MedEquip CRM",
}

export default function EditVisitPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/visits/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Visit</h1>
            <p className="text-muted-foreground">Update visit information</p>
          </div>
        </div>

        <VisitFormWrapper visitId={params.id} />
      </div>
    </DashboardShell>
  )
}
