import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DemoFormWrapper } from "@/components/demos/demo-form-wrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Edit Demo - NexFlow CRM",
}

export default function EditDemoPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/demos/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Demo</h1>
            <p className="text-muted-foreground">Update demo information</p>
          </div>
        </div>

        <DemoFormWrapper demoId={params.id} />
      </div>
    </DashboardShell>
  )
}
