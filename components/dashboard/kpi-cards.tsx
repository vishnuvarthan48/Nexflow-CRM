"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useDataStore } from "@/lib/data-store"

export function KPICards() {
  const { leads, visits, quotations } = useDataStore()

  // Calculate KPIs
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const todayLeads = leads.filter((l) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length
  const weekLeads = leads.filter((l) => new Date(l.createdAt) >= startOfWeek).length
  const openLeads = leads.filter((l) => !["Converted", "Lost"].includes(l.status)).length
  const hotLeads = leads.filter((l) => l.priority === "Hot" || l.priority === "Urgent").length
  const appointmentsScheduled = visits.filter((v) => ["Scheduled", "Confirmed"].includes(v.status)).length
  const visitsCompleted = visits.filter((v) => v.status === "Completed").length
  const quotesSent = quotations.filter((q) => ["Sent to Customer", "Approved"].includes(q.status)).length
  const poReceived = quotations.filter((q) => q.status === "PO Received").length
  const revenuePipeline = quotations
    .filter((q) => ["Approved", "Sent to Customer", "PO Received"].includes(q.status))
    .reduce((sum, q) => sum + q.totalAmount, 0)

  const kpis = [
    {
      title: "New Leads",
      value: todayLeads,
      subtitle: `${weekLeads} this week`,
      trend: "+12%",
      trendUp: true,
      status: "success",
    },
    {
      title: "Total Open Leads",
      value: openLeads,
      subtitle: "Active pipeline",
      trend: "+8%",
      trendUp: true,
      status: "info",
    },
    {
      title: "Hot Leads",
      value: hotLeads,
      subtitle: "Immediate action",
      trend: "+5%",
      trendUp: true,
      status: "warning",
    },
    {
      title: "Appointments Scheduled",
      value: appointmentsScheduled,
      subtitle: "Field pipeline",
      trend: "+15%",
      trendUp: true,
      status: "success",
    },
    {
      title: "Visits Completed",
      value: visitsCompleted,
      subtitle: "Execution tracking",
      trend: "+10%",
      trendUp: true,
      status: "info",
    },
    {
      title: "Quotes Sent",
      value: quotesSent,
      subtitle: "Revenue intent",
      trend: "+7%",
      trendUp: true,
      status: "success",
    },
    {
      title: "PO Received",
      value: poReceived,
      subtitle: "Actual conversion",
      trend: "+20%",
      trendUp: true,
      status: "success",
    },
    {
      title: "Revenue Pipeline",
      value: `₹${(revenuePipeline / 100000).toFixed(1)}L`,
      subtitle: "Business health",
      trend: "+18%",
      trendUp: true,
      status: "success",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-l-green-500 hover:border-l-green-600"
      case "warning":
        return "border-l-amber-500 hover:border-l-amber-600"
      case "danger":
        return "border-l-red-500 hover:border-l-red-600"
      default:
        return "border-l-blue-500 hover:border-l-blue-600"
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {kpis.map((kpi) => (
        <Card
          key={kpi.title}
          className={`border-l-4 ${getStatusColor(kpi.status)} shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground truncate">{kpi.title}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  kpi.trendUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {kpi.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.trend}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
