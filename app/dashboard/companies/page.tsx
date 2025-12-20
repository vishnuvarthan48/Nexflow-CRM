import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CompaniesList } from "@/components/companies/companies-list"

export const metadata = {
  title: "Companies - MedEquip CRM",
  description: "Manage company master list",
}

export default function CompaniesPage() {
  return (
    <DashboardShell>
      <CompaniesList />
    </DashboardShell>
  )
}
