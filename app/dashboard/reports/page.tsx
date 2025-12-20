import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SalesReports } from "@/components/reports/sales-reports"
import { ServiceReports } from "@/components/reports/service-reports"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Reports & Analytics - MedEquip CRM",
  description: "View reports and analytics",
}

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View performance metrics and analytics</p>
        </div>

        <Tabs defaultValue="sales" className="w-full">
          <TabsList>
            <TabsTrigger value="sales">Sales Performance</TabsTrigger>
            <TabsTrigger value="service">Service Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <SalesReports />
          </TabsContent>

          <TabsContent value="service" className="space-y-6">
            <ServiceReports />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
