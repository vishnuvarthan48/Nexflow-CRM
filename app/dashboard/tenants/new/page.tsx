import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TenantForm } from "@/components/tenants/tenant-form"

export const metadata = {
  title: "Add New Tenant - NexFlow CRM",
  description: "Create a new tenant organization",
}

export default function NewTenantPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Tenant</h1>
          <p className="text-muted-foreground">Create a new tenant organization with subscription details</p>
        </div>
        <TenantForm />
      </div>
    </DashboardShell>
  )
}
