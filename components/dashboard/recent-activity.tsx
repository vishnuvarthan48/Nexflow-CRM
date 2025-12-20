"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/lib/data-store"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight } from "lucide-react"

export function RecentActivity() {
  const { activities } = useDataStore()

  const recentActivities = [...activities].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 6)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex flex-col gap-1 border-b pb-3 last:border-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.action}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">by {activity.userName}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
