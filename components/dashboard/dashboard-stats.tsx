"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp, Wrench, Microscope, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useDataStore } from "@/lib/data-store"

export function DashboardStats() {
  const { leads, visits, quotations, demos, serviceRequests } = useDataStore()

  const activeLeads = leads.filter((l) => l.status !== "Converted" && l.status !== "Lost").length
  const upcomingVisits = visits.filter((v) => v.status === "Scheduled" || v.status === "Confirmed").length
  const pendingQuotes = quotations.filter((q) => q.status === "Pending Approval" || q.status === "Draft").length
  const scheduledDemos = demos.filter((d) => d.status === "Scheduled").length
  const openTickets = serviceRequests.filter((sr) => sr.status !== "Completed").length
  const totalRevenue = quotations
    .filter((q) => q.status === "Approved" || q.status === "Sent to Customer")
    .reduce((sum, q) => sum + q.totalAmount, 0)

  const stats = [
    {
      title: "Active Leads",
      value: activeLeads,
      icon: Users,
      description: "In pipeline",
      trend: "+12%",
      trendUp: true,
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Upcoming Visits",
      value: upcomingVisits,
      icon: Calendar,
      description: "Next 7 days",
      trend: "+5%",
      trendUp: true,
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Quotes",
      value: pendingQuotes,
      icon: FileText,
      description: "Awaiting action",
      trend: "-3%",
      trendUp: false,
      color: "from-amber-500 to-amber-600",
      lightColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Scheduled Demos",
      value: scheduledDemos,
      icon: Microscope,
      description: "This month",
      trend: "+8%",
      trendUp: true,
      color: "from-emerald-500 to-emerald-600",
      lightColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Open Service Tickets",
      value: openTickets,
      icon: Wrench,
      description: "Active requests",
      trend: "+2%",
      trendUp: true,
      color: "from-rose-500 to-rose-600",
      lightColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      title: "Revenue Pipeline",
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      description: "Approved quotes",
      trend: "+18%",
      trendUp: true,
      color: "from-teal-500 to-teal-600",
      lightColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`rounded-2xl ${stat.lightColor} p-3.5`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                  stat.trendUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {stat.trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
