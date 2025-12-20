"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import type { Lead } from "@/lib/types"

export function LeadStatusHistory({ lead }: { lead: Lead }) {
  if (!lead.statusHistory || lead.statusHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No status history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative space-y-4">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-4 h-[calc(100%-2rem)] w-0.5 bg-border" />

      {lead.statusHistory.map((entry) => (
        <Card key={entry.id} className="relative">
          <CardContent className="flex gap-4 p-4">
            {/* Timeline dot */}
            <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary">
              {entry.fromStatus ? (
                <ArrowRight className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Clock className="h-4 w-4 text-primary-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {entry.fromStatus && (
                      <>
                        <Badge variant="outline">{entry.fromStatus}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                    <Badge className="bg-primary text-primary-foreground">{entry.toStatus}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  {entry.duration !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Duration: {entry.duration} {entry.duration === 1 ? "day" : "days"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium">{entry.changedByName}</p>
                  <p className="text-xs text-muted-foreground">{format(entry.timestamp, "MMM dd, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">{format(entry.timestamp, "hh:mm a")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
