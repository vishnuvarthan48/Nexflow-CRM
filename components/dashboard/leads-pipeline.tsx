"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"
import { Progress } from "@/components/ui/progress"

export function LeadsPipeline() {
  const { leads } = useDataStore()

  const pipeline = [
    { name: "New", count: leads.filter((l) => l.status === "New").length, color: "bg-blue-500" },
    { name: "Contacted", count: leads.filter((l) => l.status === "Contacted").length, color: "bg-purple-500" },
    { name: "Qualified", count: leads.filter((l) => l.status === "Qualified").length, color: "bg-green-500" },
    {
      name: "Visit Scheduled",
      count: leads.filter((l) => l.status === "Visit Scheduled").length,
      color: "bg-orange-500",
    },
    { name: "Converted", count: leads.filter((l) => l.status === "Converted").length, color: "bg-emerald-500" },
  ]

  const totalLeads = leads.filter((l) => l.status !== "Lost").length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Pipeline</CardTitle>
        <CardDescription>Lead progression through sales stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipeline.map((stage) => (
            <div key={stage.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <span className="text-muted-foreground">
                  {stage.count} ({totalLeads > 0 ? ((stage.count / totalLeads) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <Progress value={totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
