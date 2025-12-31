"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"
import { ArrowRight } from "lucide-react"

export function LeadFunnelChart() {
  const { leads } = useDataStore()

  const funnelStages = [
    { stage: "New Leads", status: "New", count: 0 },
    { stage: "Contacted", status: "Contacted", count: 0 },
    { stage: "Qualified", status: "Qualified", count: 0 },
    { stage: "Proposal", status: "Proposal Sent", count: 0 },
    { stage: "Negotiation", status: "Negotiation", count: 0 },
    { stage: "Converted", status: "Converted", count: 0 },
  ]

  // Count leads in each stage
  funnelStages.forEach((stage) => {
    stage.count = leads.filter((l) => l.status === stage.status).length
  })

  // Calculate conversion rates
  const getConversionRate = (index: number) => {
    if (index === 0) return null
    const previous = funnelStages[index - 1].count
    const current = funnelStages[index].count
    if (previous === 0) return "0%"
    return `${Math.round((current / previous) * 100)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {funnelStages.map((stage, index) => (
            <div key={stage.stage} className="flex items-center gap-2">
              <div className="flex-shrink-0 text-center">
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 min-w-[120px] hover:shadow-md transition-shadow">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{stage.stage}</p>
                  <p className="text-2xl font-bold text-blue-600">{stage.count}</p>
                </div>
              </div>
              {index < funnelStages.length - 1 && (
                <div className="flex-shrink-0 flex flex-col items-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground mb-1" />
                  {getConversionRate(index + 1) && (
                    <span className="text-xs font-semibold text-green-600">{getConversionRate(index + 1)}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
