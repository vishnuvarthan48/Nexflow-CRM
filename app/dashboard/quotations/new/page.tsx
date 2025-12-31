import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuotationForm } from "@/components/quotations/quotation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "New Quotation - NexFlow CRM",
}

export default function NewQuotationPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">New Quotation</h1>
            <p className="text-muted-foreground">Create a new quotation for a customer</p>
          </div>
        </div>

        <QuotationForm />
      </div>
    </DashboardShell>
  )
}
