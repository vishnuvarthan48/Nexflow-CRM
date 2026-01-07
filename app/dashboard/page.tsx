import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TenantsList } from "@/components/tenants/tenants-list"

export const metadata = {
  title: "Tenant Management - NexFlow CRM",
  description: "Manage tenant organizations and subscriptions",
}

export default function TenantsPage() {
  return (
    <DashboardShell>
      <TenantsList />
    </DashboardShell>
  )
}
