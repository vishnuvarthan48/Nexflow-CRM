import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuotationFormWrapper } from "@/components/quotations/quotation-form-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Edit Quotation - MedEquip CRM",
}

export default function EditQuotationPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/quotations/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Quotation</h1>
            <p className="text-muted-foreground">Update quotation information</p>
          </div>
        </div>

        <QuotationFormWrapper quotationId={params.id} />
      </div>
    </DashboardShell>
  )
}
