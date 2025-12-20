"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/lib/data-store"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function UpcomingVisits() {
  const { visits, leads } = useDataStore()

  const upcomingVisits = visits
    .filter((v) => v.status === "Scheduled" || v.status === "Confirmed")
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
    .slice(0, 4)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Visits</CardTitle>
        <Link href="/dashboard/visits">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingVisits.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No upcoming visits</p>
          ) : (
            upcomingVisits.map((visit) => {
              const lead = leads.find((l) => l.id === visit.leadId)
              return (
                <Link key={visit.id} href={`/dashboard/visits/${visit.id}`}>
                  <div className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-accent">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{lead?.customerName || "Unknown"}</p>
                      <Badge variant="outline" className="text-xs">
                        {visit.visitType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(visit.scheduledDate, "MMM dd, yyyy")} at {visit.scheduledTime}
                    </p>
                    <p className="text-xs text-muted-foreground">{visit.purpose}</p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
