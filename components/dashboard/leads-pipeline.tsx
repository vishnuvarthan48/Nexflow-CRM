"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"

export function LeadsPipeline() {
  const { leads } = useDataStore()

  const pipeline = [
    { name: "New", count: leads.filter((l) => l.status === "New").length, color: "bg-purple-500" },
    { name: "Contacted", count: leads.filter((l) => l.status === "Contacted").length, color: "bg-blue-500" },
    { name: "Qualified", count: leads.filter((l) => l.status === "Qualified").length, color: "bg-emerald-500" },
    {
      name: "Visit Scheduled",
      count: leads.filter((l) => l.status === "Visit Scheduled").length,
      color: "bg-orange-500",
    },
    { name: "Converted", count: leads.filter((l) => l.status === "Converted").length, color: "bg-pink-500" },
  ]

  const totalLeads = leads.filter((l) => l.status !== "Lost").length

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sales Pipeline</CardTitle>
        <CardDescription className="text-base">Lead progression through sales stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pipeline.map((stage) => (
            <div key={stage.name}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                  <span className="font-semibold text-base">{stage.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold">{stage.count}</span>
                  <span className="text-sm text-muted-foreground">
                    ({totalLeads > 0 ? ((stage.count / totalLeads) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full ${stage.color} transition-all duration-500`}
                  style={{ width: `${totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
