"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp, Wrench, Microscope } from "lucide-react"
import { useDataStore } from "@/lib/data-store"

export function DashboardStats() {
  const { leads, visits, quotations, demos, serviceRequests } = useDataStore()

  const stats = [
    {
      title: "Active Leads",
      value: leads.filter((l) => l.status !== "Converted" && l.status !== "Lost").length,
      icon: Users,
      description: "In pipeline",
      trend: "+12% from last month",
    },
    {
      title: "Upcoming Visits",
      value: visits.filter((v) => v.status === "Scheduled" || v.status === "Confirmed").length,
      icon: Calendar,
      description: "Next 7 days",
      trend: "5 this week",
    },
    {
      title: "Pending Quotes",
      value: quotations.filter((q) => q.status === "Pending Approval" || q.status === "Draft").length,
      icon: FileText,
      description: "Awaiting action",
      trend: `₹${quotations
        .filter((q) => q.status === "Pending Approval")
        .reduce((sum, q) => sum + q.totalAmount, 0)
        .toLocaleString()} value`,
    },
    {
      title: "Scheduled Demos",
      value: demos.filter((d) => d.status === "Scheduled").length,
      icon: Microscope,
      description: "This month",
      trend: "3 completed",
    },
    {
      title: "Open Service Tickets",
      value: serviceRequests.filter((sr) => sr.status !== "Completed").length,
      icon: Wrench,
      description: "Active requests",
      trend: `${serviceRequests.filter((sr) => sr.priority === "Urgent").length} urgent`,
    },
    {
      title: "Revenue Pipeline",
      value: `₹${(quotations.filter((q) => q.status === "Approved" || q.status === "Sent to Customer").reduce((sum, q) => sum + q.totalAmount, 0) / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      description: "Approved quotes",
      trend: "+18% growth",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="mt-1 text-xs font-medium text-primary">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
