"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/lib/data-store"
import type { LeadStatus } from "@/lib/types"
import { format } from "date-fns"
import { Mail, Phone, MapPin, Calendar, Edit, CalendarPlus } from "lucide-react"
import Link from "next/link"
import { LeadStatusHistory } from "./lead-status-history"

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-purple-100 text-purple-700",
  Qualified: "bg-green-100 text-green-700",
  "Visit Scheduled": "bg-orange-100 text-orange-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Lost: "bg-gray-100 text-gray-700",
}

export function LeadDetail({ leadId }: { leadId: string }) {
  const { leads, visits, enquiries, activities } = useDataStore()

  const lead = leads.find((l) => l.id === leadId)
  const leadVisits = visits.filter((v) => v.leadId === leadId)
  const leadEnquiries = enquiries.filter((e) => e.leadId === leadId)
  const leadActivities = activities.filter((a) => a.entityType === "Lead" && a.entityId === leadId)

  if (!lead) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Lead not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Lead Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{lead.leadName}</CardTitle>
                <Badge className={statusColors[lead.status as LeadStatus]} variant="secondary">
                  {lead.status}
                </Badge>
              </div>
              <CardDescription>{lead.companyName}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/visits/schedule?leadId=${leadId}`}>
                <Button variant="outline">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Schedule Visit
                </Button>
              </Link>
              <Link href={`/dashboard/leads/${leadId}/edit`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {lead.city}, {lead.state} - {lead.pincode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created {format(lead.createdAt, "MMM dd, yyyy")}</span>
            </div>
          </div>
          {lead.notes && (
            <div className="mt-4 rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">Notes:</p>
              <p className="text-sm text-muted-foreground">{lead.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for details */}
      <Tabs defaultValue="status-history" className="w-full">
        <TabsList>
          <TabsTrigger value="status-history">Status History ({lead.statusHistory?.length || 0})</TabsTrigger>
          <TabsTrigger value="visits">Visits ({leadVisits.length})</TabsTrigger>
          <TabsTrigger value="enquiries">Enquiries ({leadEnquiries.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity ({leadActivities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="status-history" className="space-y-4">
          <LeadStatusHistory lead={lead} />
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          {leadVisits.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No visits scheduled</p>
              </CardContent>
            </Card>
          ) : (
            leadVisits.map((visit) => (
              <Card key={visit.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{visit.visitType} Visit</CardTitle>
                      <CardDescription>
                        {format(visit.scheduledDate, "MMM dd, yyyy")} at {visit.scheduledTime}
                      </CardDescription>
                    </div>
                    <Badge>{visit.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{visit.purpose}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Assigned to: {visit.assignedToName}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="enquiries" className="space-y-4">
          {leadEnquiries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No enquiries created</p>
              </CardContent>
            </Card>
          ) : (
            leadEnquiries.map((enquiry) => (
              <Card key={enquiry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Enquiry {enquiry.id}</CardTitle>
                      <CardDescription>Created {format(enquiry.createdAt, "MMM dd, yyyy")}</CardDescription>
                    </div>
                    <Badge>{enquiry.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold">₹{enquiry.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {enquiry.products.length} product(s) - Price Category {enquiry.priceCategory}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {leadActivities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="flex items-start justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">by {activity.userName}</p>
                </div>
                <span className="text-xs text-muted-foreground">{format(activity.timestamp, "MMM dd, HH:mm")}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
