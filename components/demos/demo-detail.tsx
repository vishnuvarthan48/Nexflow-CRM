"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { DemoStatus } from "@/lib/types"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Edit } from "lucide-react"
import Link from "next/link"

const statusColors: Record<DemoStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
}

export function DemoDetail({ demoId }: { demoId: string }) {
  const { demos, refresh } = useDataStore()

  const demo = demos.find((d) => d.id === demoId)

  const handleStatusUpdate = (status: DemoStatus) => {
    if (!demo) return

    dataStore.updateDemo(demo.id, { status })

    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Demo",
      entityId: demo.id,
      action: "Status Updated",
      description: `Demo status changed to ${status}`,
      userId: "u2",
      userName: "Priya Sharma",
      timestamp: new Date(),
    })

    refresh()
  }

  if (!demo) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Demo not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Demo Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">Product Demonstration</CardTitle>
                <Badge className={statusColors[demo.status]} variant="secondary">
                  {demo.status}
                </Badge>
              </div>
              <CardDescription>{demo.customerName}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/demos/${demoId}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(demo.scheduledDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{demo.scheduledTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{demo.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Assigned to: {demo.assignedToName}</span>
            </div>
          </div>

          {/* Products */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="mb-2 text-sm font-medium">Products to Demonstrate:</p>
            <div className="flex flex-wrap gap-2">
              {demo.products.map((product, index) => (
                <Badge key={index} variant="secondary">
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {demo.status === "Scheduled" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("In Progress")}>
                Start Demo
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Completed")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Cancelled")}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Demo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Outcome */}
      {demo.status === "Completed" && (demo.outcome || demo.feedback) && (
        <Card>
          <CardHeader>
            <CardTitle>Demo Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {demo.outcome && (
              <div>
                <p className="text-sm font-medium">Outcome:</p>
                <p className="text-sm text-muted-foreground">{demo.outcome}</p>
              </div>
            )}
            {demo.feedback && (
              <div>
                <p className="text-sm font-medium">Customer Feedback:</p>
                <p className="text-sm text-muted-foreground">{demo.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
