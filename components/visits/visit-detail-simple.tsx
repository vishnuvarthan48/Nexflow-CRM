"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { VisitStatus } from "@/lib/types"
import { format } from "date-fns"
import { Calendar, Clock, User, MapPin, Edit, CheckCircle, XCircle, CalendarPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const statusColors: Record<VisitStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Confirmed: "bg-green-100 text-green-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-orange-100 text-orange-700",
}

export function VisitDetailSimple({ visitId }: { visitId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { visits, leads, refresh } = useDataStore()
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({
    status: "" as VisitStatus,
    notes: "",
    rescheduledDate: "",
  })

  const visit = visits.find((v) => v.id === visitId)
  const lead = visit?.leadId ? leads.find((l) => l.id === visit.leadId) : undefined

  if (!visit) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Visit not found</p>
        </CardContent>
      </Card>
    )
  }

  const handleQuickStatusUpdate = (newStatus: VisitStatus) => {
    dataStore.updateVisit(visit.id, { status: newStatus })
    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Visit",
      entityId: visit.id,
      action: "Status Updated",
      description: `Visit status changed to ${newStatus}`,
      userId: "u2",
      userName: "Priya Sharma",
      timestamp: new Date(),
    })
    toast({ title: "Success", description: `Visit marked as ${newStatus}` })
    refresh()
  }

  const handleDetailedStatusUpdate = () => {
    if (!statusUpdate.status) {
      toast({ title: "Error", description: "Please select a status", variant: "destructive" })
      return
    }

    const updateData: any = {
      status: statusUpdate.status,
      outcome: statusUpdate.notes,
    }

    if (statusUpdate.status === "Rescheduled" && statusUpdate.rescheduledDate) {
      updateData.rescheduledDate = new Date(statusUpdate.rescheduledDate)
      updateData.scheduledDate = new Date(statusUpdate.rescheduledDate)
    }

    dataStore.updateVisit(visit.id, updateData)
    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Visit",
      entityId: visit.id,
      action: "Status Updated",
      description: `Visit status changed to ${statusUpdate.status}${statusUpdate.notes ? `: ${statusUpdate.notes}` : ""}`,
      userId: "u2",
      userName: "Priya Sharma",
      timestamp: new Date(),
    })

    toast({ title: "Success", description: "Visit status updated successfully" })
    setShowStatusDialog(false)
    setStatusUpdate({ status: "" as VisitStatus, notes: "", rescheduledDate: "" })
    refresh()
  }

  const handleScheduleRevisit = () => {
    const params = new URLSearchParams({
      leadId: visit.leadId || "",
      customerName: visit.customerName,
      purpose: visit.purpose,
      ...(visit.followUpDate && { scheduledDate: format(visit.followUpDate, "yyyy-MM-dd") }),
    })
    router.push(`/dashboard/visits/schedule?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Main Visit Card */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Visit Details</TabsTrigger>
          <TabsTrigger value="history">Status History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{visit.customerName}</CardTitle>
                    <Badge className={statusColors[visit.status]} variant="secondary">
                      {visit.status}
                    </Badge>
                  </div>
                  <CardDescription>Visit ID: {visit.id}</CardDescription>
                </div>
                <Link href={`/dashboard/visits/${visitId}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visit Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Visit Date</p>
                    <p className="text-sm text-muted-foreground">{format(visit.scheduledDate, "dd MMM yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{visit.scheduledTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">{visit.assignedToName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {visit.city}
                      {visit.city && visit.state && ", "}
                      {visit.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-semibold mb-1">Purpose</p>
                <p className="text-sm text-muted-foreground">{visit.purpose}</p>
              </div>

              {/* Contact Info */}
              {visit.pocName && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-semibold mb-2">Contact Person</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {visit.pocName}
                    </p>
                    {visit.pocMobile && (
                      <p className="text-sm">
                        <span className="font-medium">Mobile:</span> {visit.pocMobile}
                      </p>
                    )}
                    {visit.pocEmail && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {visit.pocEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {visit.notes && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-semibold mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">{visit.notes}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {visit.status === "Scheduled" && (
                  <>
                    <Button variant="default" size="sm" onClick={() => handleQuickStatusUpdate("Confirmed")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Visit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowStatusDialog(true)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                  </>
                )}
                {visit.status === "Confirmed" && (
                  <>
                    <Button variant="default" size="sm" onClick={() => handleQuickStatusUpdate("Completed")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowStatusDialog(true)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                  </>
                )}
                {(visit.status === "Completed" || visit.status === "Confirmed") && (
                  <Button variant="outline" size="sm" onClick={handleScheduleRevisit}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Schedule Follow-up Visit
                  </Button>
                )}
                {visit.status === "Scheduled" && (
                  <Button variant="destructive" size="sm" onClick={() => handleQuickStatusUpdate("Cancelled")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Visit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lead Info if available */}
          {lead && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">{lead.leadName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-muted-foreground">{lead.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/dashboard/leads/${lead.id}`}>
                    <Button variant="outline" size="sm">
                      View Full Lead Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Status History tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
              <CardDescription>Track all status changes for this visit</CardDescription>
            </CardHeader>
            <CardContent>
              {visit.statusHistory && visit.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {visit.statusHistory.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`} />
                        {index !== visit.statusHistory!.length - 1 && <div className="w-0.5 h-full bg-border mt-1" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {entry.fromStatus && (
                              <Badge variant="outline" className="text-xs">
                                {entry.fromStatus}
                              </Badge>
                            )}
                            {entry.fromStatus && <span className="text-muted-foreground">→</span>}
                            <Badge className={statusColors[entry.toStatus as VisitStatus]} variant="secondary">
                              {entry.toStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(entry.timestamp, "dd MMM yyyy, hh:mm a")}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Changed by <span className="font-medium">{entry.changedByName}</span>
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{entry.notes}</p>
                        )}
                        {entry.duration && entry.duration > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Time in previous status: <span className="font-medium">{entry.duration} days</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No status history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Visit Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select
                value={statusUpdate.status}
                onValueChange={(value: VisitStatus) => setStatusUpdate({ ...statusUpdate, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {statusUpdate.status === "Rescheduled" && (
              <div className="space-y-2">
                <Label htmlFor="rescheduledDate">New Date</Label>
                <Input
                  id="rescheduledDate"
                  type="date"
                  value={statusUpdate.rescheduledDate}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, rescheduledDate: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this status change..."
                value={statusUpdate.notes}
                onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDetailedStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
