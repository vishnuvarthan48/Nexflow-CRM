import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DemoDetail } from "@/components/demos/demo-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Demo Details - NexFlow CRM",
}

export default function DemoDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/demos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demo Details</h1>
            <p className="text-muted-foreground">View and manage demo information</p>
          </div>
        </div>

        <DemoDetail demoId={params.id} />
      </div>
    </DashboardShell>
  )
}
