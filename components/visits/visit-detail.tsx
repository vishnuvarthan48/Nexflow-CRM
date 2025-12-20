"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { VisitStatus, VisitOutcomeStatus, Visit } from "@/lib/types"
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Edit,
  CheckCircle,
  XCircle,
  Link2,
  FileText,
  Wrench,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const statusColors: Record<VisitStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Confirmed: "bg-green-100 text-green-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-orange-100 text-orange-700",
}

export function VisitDetail({ visitId }: { visitId: string }) {
  const router = useRouter()
  const { visits, leads, refresh } = useDataStore()
  const [showAttachLeadDialog, setShowAttachLeadDialog] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState("")
  const [showRevisitDialog, setShowRevisitDialog] = useState(false)
  const [showStatusUpdateDialog, setShowStatusUpdateDialog] = useState(false)
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: "" as VisitStatus,
    outcomeStatus: "" as VisitOutcomeStatus | "",
    nextScheduleDate: "",
    rescheduledDate: "",
    rescheduledReason: "",
    description: "",
    clientRequest: "",
  })

  const visit = visits.find((v) => v.id === visitId)
  const lead = visit?.leadId ? leads.find((l) => l.id === visit.leadId) : undefined

  const handleStatusUpdate = (status: VisitStatus) => {
    if (!visit) return

    dataStore.updateVisit(visit.id, { status })

    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Visit",
      entityId: visit.id,
      action: "Status Updated",
      description: `Visit status changed to ${status}`,
      userId: "u2",
      userName: "Priya Sharma",
      timestamp: new Date(),
    })

    refresh()
  }

  const handleConvertToLead = () => {
    if (!visit) return

    router.push(`/dashboard/leads/new?fromVisit=${visit.id}`)
  }

  const handleAttachToLead = () => {
    if (!visit || !selectedLeadId) return

    dataStore.updateVisit(visit.id, { leadId: selectedLeadId })

    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Visit",
      entityId: visit.id,
      action: "Attached to Lead",
      description: `Visit attached to lead ${selectedLeadId}`,
      userId: "u2",
      userName: "Priya Sharma",
      timestamp: new Date(),
    })

    setShowAttachLeadDialog(false)
    refresh()
    router.refresh()
  }

  const handleConvertToEnquiry = () => {
    if (!visit) return
    router.push(`/dashboard/enquiries/new?fromVisit=${visit.id}`)
  }

  const handleConvertToService = () => {
    if (!visit) return
    router.push(`/dashboard/service/new?fromVisit=${visit.id}`)
  }

  const handleScheduleRevisit = () => {
    if (!visit) return

    const params = new URLSearchParams({
      leadId: visit.leadId || "",
      customerName: visit.customerName || "",
      pocName: visit.pocName || "",
      pocMobile: visit.pocMobile || "",
      pocEmail: visit.pocEmail || "",
      address: visit.address || "",
      city: visit.city || "",
      state: visit.state || "",
      pincode: visit.pincode || "",
      visitType: "Follow-up",
      previousVisitId: visit.id,
      scheduledDate: visit.followUpDate ? format(new Date(visit.followUpDate), "yyyy-MM-dd") : "",
      purpose: `Follow-up visit for previous visit ${visit.id}`,
      productsToDiscuss: visit.productsToDiscuss?.join(",") || "",
    })

    router.push(`/dashboard/visits/schedule?${params.toString()}`)
  }

  const handleSaveStatusUpdate = () => {
    if (!visit || !statusUpdateData.status) return

    const updateData: Partial<Visit> = {
      status: statusUpdateData.status,
      outcomeStatus: statusUpdateData.outcomeStatus || undefined,
      outcome: statusUpdateData.description,
      outcomeRemarks: statusUpdateData.clientRequest,
      followUpDate: statusUpdateData.nextScheduleDate ? new Date(statusUpdateData.nextScheduleDate) : undefined,
      followUpRequired: !!statusUpdateData.nextScheduleDate,
    }

    if (statusUpdateData.status === "Rescheduled" && statusUpdateData.rescheduledDate) {
      updateData.rescheduledDate = new Date(statusUpdateData.rescheduledDate)
      updateData.rescheduledReason = statusUpdateData.rescheduledReason
    }

    dataStore.updateVisit(visit.id, updateData)

    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Visit",
      entityId: visit.id,
      action: "Status Updated",
      description: `Visit status changed to ${statusUpdateData.status}${
        statusUpdateData.clientRequest ? ` - Client Request: ${statusUpdateData.clientRequest}` : ""
      }${statusUpdateData.rescheduledReason ? ` - Reason: ${statusUpdateData.rescheduledReason}` : ""}`,
      userId: "u2",
      userName: "Priya Sharma",
      timestamp: new Date(),
    })

    setShowStatusUpdateDialog(false)
    setStatusUpdateData({
      status: "" as VisitStatus,
      outcomeStatus: "",
      nextScheduleDate: "",
      rescheduledDate: "",
      rescheduledReason: "",
      description: "",
      clientRequest: "",
    })
    refresh()
  }

  if (!visit) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Visit not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Visit Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">
                  {visit.visitType} Visit - {visit.customerName || lead?.leadName || "Unknown Customer"}
                </CardTitle>
                <Badge className={statusColors[visit.status]} variant="secondary">
                  {visit.status}
                </Badge>
                {!visit.leadId && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    Direct Visit
                  </Badge>
                )}
              </div>
              <CardDescription>{lead?.companyName || visit.customerName}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/visits/${visitId}/edit`}>
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
              <span>{format(visit.scheduledDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{visit.scheduledTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Assigned to: {visit.assignedToName}</span>
            </div>
            {(visit.city || visit.state) && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {visit.city}
                  {visit.city && visit.state && ", "}
                  {visit.state}
                </span>
              </div>
            )}
          </div>

          {/* POC Information */}
          {visit.pocName && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">Point of Contact:</p>
              <p className="text-sm text-muted-foreground">{visit.pocName}</p>
              {visit.pocMobile && <p className="text-sm text-muted-foreground">Mobile: {visit.pocMobile}</p>}
              {visit.pocEmail && <p className="text-sm text-muted-foreground">Email: {visit.pocEmail}</p>}
            </div>
          )}

          {/* Purpose */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">Purpose:</p>
            <p className="text-sm text-muted-foreground">{visit.purpose}</p>
          </div>

          {/* Notes */}
          {visit.notes && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">Notes:</p>
              <p className="text-sm text-muted-foreground">{visit.notes}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            {/* Current Visit Status Actions */}
            <div className="rounded-lg border bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900 mb-3">Current Visit Actions</p>
              <div className="flex flex-wrap gap-2">
                {visit.status === "Scheduled" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Confirmed")}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Visit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Cancelled")}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Visit
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowStatusUpdateDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Status & Add Notes
                </Button>
              </div>
            </div>

            {/* Schedule New Revisit */}
            {(visit.status === "Completed" || visit.status === "Confirmed") && (
              <div className="rounded-lg border bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">Schedule Follow-up</p>
                <p className="text-xs text-green-700 mb-3">Create a new visit based on this visit</p>
                <Button variant="default" size="sm" onClick={handleScheduleRevisit}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Revisit
                </Button>
              </div>
            )}
          </div>

          {/* Conversion Options */}
          {!visit.leadId && (
            <div className="rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4">
              <p className="text-sm font-medium text-orange-900 mb-3">Conversion Options</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleConvertToLead}>
                  <FileText className="mr-2 h-4 w-4" />
                  Convert to Lead
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAttachLeadDialog(true)}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Attach to Existing Lead
                </Button>
                <Button variant="outline" size="sm" onClick={handleConvertToEnquiry}>
                  <FileText className="mr-2 h-4 w-4" />
                  Convert to Enquiry
                </Button>
                <Button variant="outline" size="sm" onClick={handleConvertToService}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Convert to Service Ticket
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visit Outcome */}
      {visit.status === "Completed" && visit.outcome && (
        <Card>
          <CardHeader>
            <CardTitle>Visit Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {visit.outcomeStatus && (
              <div>
                <p className="text-sm font-medium">Status:</p>
                <Badge className="mt-1">{visit.outcomeStatus}</Badge>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Outcome:</p>
              <p className="text-sm text-muted-foreground">{visit.outcome}</p>
            </div>
            {visit.outcomeRemarks && (
              <div>
                <p className="text-sm font-medium">Remarks:</p>
                <p className="text-sm text-muted-foreground">{visit.outcomeRemarks}</p>
              </div>
            )}
            {visit.followUpRequired && (
              <div className="rounded-lg border bg-orange-50 p-4">
                <p className="text-sm font-medium text-orange-900">Follow-up Required</p>
                {visit.followUpDate && (
                  <p className="text-sm text-orange-700">Scheduled for: {format(visit.followUpDate, "MMM dd, yyyy")}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lead Information */}
      {lead && (
        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
              <div className="sm:col-span-2">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {lead.address}, {lead.city}, {lead.state} - {lead.pincode}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/leads/${lead.id}`}>
                <Button variant="outline" size="sm">
                  View Lead Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different sections */}
      <Tabs defaultValue="status-history" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status-history">Status History</TabsTrigger>
          <TabsTrigger value="details">Visit Details</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="status-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visit Status History</CardTitle>
              <CardDescription>Track all status changes and progress for this visit</CardDescription>
            </CardHeader>
            <CardContent>
              {visit.statusHistory && visit.statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {visit.statusHistory.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        {index < visit.statusHistory!.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.fromStatus && (
                            <>
                              <Badge variant="outline">{entry.fromStatus}</Badge>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </>
                          )}
                          <Badge className="bg-primary">{entry.toStatus}</Badge>
                          {entry.duration && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ({entry.duration} {entry.duration === 1 ? "day" : "days"} in previous status)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          By {entry.changedByName} • {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        {entry.notes && <p className="text-sm mt-2">{entry.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No status history available. Status changes will be tracked here.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle>Visit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(visit.scheduledDate, "EEEE, MMMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned to: {visit.assignedToName}</span>
                </div>
                {(visit.city || visit.state) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {visit.city}
                      {visit.city && visit.state && ", "}
                      {visit.state}
                    </span>
                  </div>
                )}
              </div>

              {/* POC Information */}
              {visit.pocName && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium">Point of Contact:</p>
                  <p className="text-sm text-muted-foreground">{visit.pocName}</p>
                  {visit.pocMobile && <p className="text-sm text-muted-foreground">Mobile: {visit.pocMobile}</p>}
                  {visit.pocEmail && <p className="text-sm text-muted-foreground">Email: {visit.pocEmail}</p>}
                </div>
              )}

              {/* Purpose */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium">Purpose:</p>
                <p className="text-sm text-muted-foreground">{visit.purpose}</p>
              </div>

              {/* Notes */}
              {visit.notes && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm font-medium">Notes:</p>
                  <p className="text-sm text-muted-foreground">{visit.notes}</p>
                </div>
              )}

              {/* Status Update Dialog */}
              <Dialog open={showStatusUpdateDialog} onOpenChange={setShowStatusUpdateDialog}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Update Visit Status</DialogTitle>
                    <DialogDescription>Update the visit status with client request details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitStatus">Visit Status *</Label>
                      <Select
                        value={statusUpdateData.status}
                        onValueChange={(value: VisitStatus) =>
                          setStatusUpdateData({ ...statusUpdateData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visit status" />
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

                    {statusUpdateData.status === "Completed" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="outcomeStatus">Outcome Status</Label>
                          <Select
                            value={statusUpdateData.outcomeStatus}
                            onValueChange={(value: VisitOutcomeStatus) =>
                              setStatusUpdateData({ ...statusUpdateData, outcomeStatus: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select outcome status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Next Visit Scheduled">Next Visit Scheduled</SelectItem>
                              <SelectItem value="Demo Request / Trial Request">Demo Request / Trial Request</SelectItem>
                              <SelectItem value="Follow-up">Follow-up</SelectItem>
                              <SelectItem value="Request Quotation">Request Quotation</SelectItem>
                              <SelectItem value="Waiting for PO">Waiting for PO</SelectItem>
                              <SelectItem value="PO Received">PO Received</SelectItem>
                              <SelectItem value="Rescheduled Visit">Rescheduled Visit</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                              <SelectItem value="No Current Requirements">No Current Requirements</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nextScheduleDate">Next Schedule Date</Label>
                          <Input
                            id="nextScheduleDate"
                            type="date"
                            value={statusUpdateData.nextScheduleDate}
                            onChange={(e) =>
                              setStatusUpdateData({ ...statusUpdateData, nextScheduleDate: e.target.value })
                            }
                          />
                          <p className="text-sm text-muted-foreground">Set a follow-up date for next visit or action</p>
                        </div>
                      </>
                    )}

                    {statusUpdateData.status === "Rescheduled" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="rescheduledDate">New Scheduled Date *</Label>
                          <Input
                            id="rescheduledDate"
                            type="date"
                            value={statusUpdateData.rescheduledDate}
                            onChange={(e) =>
                              setStatusUpdateData({ ...statusUpdateData, rescheduledDate: e.target.value })
                            }
                            min={new Date().toISOString().split("T")[0]}
                          />
                          <p className="text-sm text-muted-foreground">Select the new date for this visit</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rescheduledReason">Reason for Rescheduling *</Label>
                          <Textarea
                            id="rescheduledReason"
                            rows={3}
                            placeholder="Why is this visit being rescheduled?"
                            value={statusUpdateData.rescheduledReason}
                            onChange={(e) =>
                              setStatusUpdateData({ ...statusUpdateData, rescheduledReason: e.target.value })
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="description">Visit Description / Summary</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder="Describe what happened during the visit..."
                        value={statusUpdateData.description}
                        onChange={(e) => setStatusUpdateData({ ...statusUpdateData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientRequest">Client Request / Feedback</Label>
                      <Textarea
                        id="clientRequest"
                        rows={4}
                        placeholder="Any specific requests or feedback from the client..."
                        value={statusUpdateData.clientRequest}
                        onChange={(e) => setStatusUpdateData({ ...statusUpdateData, clientRequest: e.target.value })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Record any specific client requirements, concerns, or special requests
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowStatusUpdateDialog(false)
                        setStatusUpdateData({
                          status: "" as VisitStatus,
                          outcomeStatus: "",
                          nextScheduleDate: "",
                          rescheduledDate: "",
                          rescheduledReason: "",
                          description: "",
                          clientRequest: "",
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveStatusUpdate}
                      disabled={
                        !statusUpdateData.status ||
                        (statusUpdateData.status === "Rescheduled" &&
                          (!statusUpdateData.rescheduledDate || !statusUpdateData.rescheduledReason))
                      }
                    >
                      Save Status Update
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">Current Visit Actions</p>
                <div className="flex flex-wrap gap-2">
                  {visit.status === "Scheduled" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Confirmed")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Visit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleStatusUpdate("Cancelled")}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Visit
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setShowStatusUpdateDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Status & Add Notes
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">Schedule Follow-up</p>
                <p className="text-xs text-green-700 mb-3">Create a new visit based on this visit</p>
                <Button variant="default" size="sm" onClick={handleScheduleRevisit}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Revisit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for activity log */}
              <p className="text-sm text-muted-foreground text-center py-8">Activity log will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attach Lead Dialog */}
      <Dialog open={showAttachLeadDialog} onOpenChange={setShowAttachLeadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach Visit to Lead</DialogTitle>
            <DialogDescription>Select an existing lead to attach this visit to</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="leadSelect">Select Lead</Label>
              <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.leadName} - {lead.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAttachLeadDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAttachToLead} disabled={!selectedLeadId}>
              Attach to Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
