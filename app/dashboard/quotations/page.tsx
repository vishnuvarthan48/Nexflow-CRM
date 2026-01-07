import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuotationDetail } from "@/components/quotations/quotation-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Quotation Details - NexFlow CRM",
}

export default function QuotationDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quotations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotation Details</h1>
            <p className="text-muted-foreground">View and manage quotation</p>
          </div>
        </div>

        <QuotationDetail quotationId={params.id} />
      </div>
    </DashboardShell>
  )
}
