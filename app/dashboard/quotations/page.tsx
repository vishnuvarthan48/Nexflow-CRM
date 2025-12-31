import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { QuotationsList } from "@/components/quotations/quotations-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Quotations - NexFlow CRM",
  description: "Manage quotations and approvals",
}

export default function QuotationsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">Create and manage customer quotations</p>
          </div>
          <Link href="/dashboard/quotations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          </Link>
        </div>

        <QuotationsList />
      </div>
    </DashboardShell>
  )
}
