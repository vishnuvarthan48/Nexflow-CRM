"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { ServiceStatus } from "@/lib/types"
import { format } from "date-fns"
import { Calendar, User, Package, AlertCircle, CheckCircle, Edit } from "lucide-react"
import Link from "next/link"

const statusColors: Record<ServiceStatus, string> = {
  Requested: "bg-blue-100 text-blue-700",
  Scheduled: "bg-purple-100 text-purple-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
}

const priorityColors = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
}

export function ServiceRequestDetail({ serviceRequestId }: { serviceRequestId: string }) {
  const { serviceRequests, refresh } = useDataStore()

  const serviceRequest = serviceRequests.find((sr) => sr.id === serviceRequestId)

  const handleStatusUpdate = (status: ServiceStatus) => {
    if (!serviceRequest) return

    dataStore.updateServiceRequest(serviceRequest.id, { status })

    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Service",
      entityId: serviceRequest.id,
      action: "Status Updated",
      description: `Service request status changed to ${status}`,
      userId: "u3",
      userName: "Amit Patel",
      timestamp: new Date(),
    })

    refresh()
  }

  if (!serviceRequest) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Service request not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Service Request Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{serviceRequest.ticketNumber}</CardTitle>
                <Badge className={statusColors[serviceRequest.status]} variant="secondary">
                  {serviceRequest.status}
                </Badge>
                <Badge className={priorityColors[serviceRequest.priority]} variant="secondary">
                  {serviceRequest.priority}
                </Badge>
              </div>
              <CardDescription>{serviceRequest.customerName}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/service/${serviceRequestId}/edit`}>
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
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Product: {serviceRequest.productName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span>Issue Type: {serviceRequest.issueType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Assigned to: {serviceRequest.assignedToName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created: {format(serviceRequest.createdAt, "MMM dd, yyyy")}</span>
            </div>
            {serviceRequest.scheduledDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>Scheduled: {format(serviceRequest.scheduledDate, "MMM dd, yyyy")}</span>
              </div>
            )}
            {serviceRequest.completedDate && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Completed: {format(serviceRequest.completedDate, "MMM dd, yyyy")}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">Issue Description:</p>
            <p className="text-sm text-muted-foreground">{serviceRequest.description}</p>
          </div>

          {/* Quick Actions */}
          {serviceRequest.status !== "Completed" && (
            <div className="flex gap-2">
              {serviceRequest.status === "Requested" && (
                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Scheduled")}>
                  Schedule Service
                </Button>
              )}
              {serviceRequest.status === "Scheduled" && (
                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("In Progress")}>
                  Start Service
                </Button>
              )}
              {(serviceRequest.status === "In Progress" || serviceRequest.status === "Scheduled") && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Completed")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("On Hold")}>
                    Put On Hold
                  </Button>
                </>
              )}
              {serviceRequest.status === "On Hold" && (
                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("In Progress")}>
                  Resume Service
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolution */}
      {serviceRequest.status === "Completed" && serviceRequest.resolution && (
        <Card>
          <CardHeader>
            <CardTitle>Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{serviceRequest.resolution}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
