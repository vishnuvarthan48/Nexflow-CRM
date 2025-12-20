import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DemoForm } from "@/components/demos/demo-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Schedule Demo - MedEquip CRM",
}

export default function NewDemoPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Schedule Demo</h1>
            <p className="text-muted-foreground">Schedule a product demonstration</p>
          </div>
        </div>

        <DemoForm />
      </div>
    </DashboardShell>
  )
}
