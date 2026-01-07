import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DemosList } from "@/components/demos/demos-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Demos - NexFlow CRM",
  description: "Manage product demonstrations",
}

export default function DemosPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demonstrations</h1>
            <p className="text-muted-foreground">Schedule and manage product demos</p>
          </div>
          <Link href="/dashboard/demos/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Demo
            </Button>
          </Link>
        </div>

        <DemosList />
      </div>
    </DashboardShell>
  )
}
