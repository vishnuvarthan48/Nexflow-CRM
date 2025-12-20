"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, useDataStore } from "@/lib/data-store"
import { useToast } from "@/components/ui/use-toast"
import type { Visit } from "@/lib/types"

interface VisitFormSimpleProps {
  visit?: Visit
  prefilledLeadId?: string
}

export function VisitFormSimple({ visit, prefilledLeadId }: VisitFormSimpleProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { users, leads } = useDataStore()

  const [formData, setFormData] = useState({
    leadId: visit?.leadId || prefilledLeadId || "",
    scheduledDate: visit?.scheduledDate ? new Date(visit.scheduledDate).toISOString().split("T")[0] : "",
    scheduledTime: visit?.scheduledTime || "",
    assignedTo: visit?.assignedTo || "",
    purpose: visit?.purpose || "",
    notes: visit?.notes || "",
  })

  useEffect(() => {
    if (prefilledLeadId && !visit) {
      const lead = leads.find((l) => l.id === prefilledLeadId)
      if (lead) {
        setFormData((prev) => ({ ...prev, leadId: lead.id }))
      }
    }
  }, [prefilledLeadId, leads, visit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedLead = leads.find((l) => l.id === formData.leadId)
    const assignedUser = users.find((u) => u.id === formData.assignedTo)

    if (!selectedLead) {
      toast({ title: "Error", description: "Please select a valid lead", variant: "destructive" })
      return
    }

    if (visit) {
      dataStore.updateVisit(visit.id, {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate),
        assignedToName: assignedUser?.name || "",
      })

      toast({ title: "Success", description: "Visit updated successfully" })
    } else {
      const visitId = dataStore.generateVisitId()
      const newVisit: Visit = {
        id: visitId,
        leadId: formData.leadId,
        customerName: selectedLead.companyName,
        pocName: selectedLead.leadName,
        pocMobile: selectedLead.phone || "",
        pocEmail: selectedLead.email || "",
        visitType: "Initial",
        scheduledDate: new Date(formData.scheduledDate),
        scheduledTime: formData.scheduledTime,
        status: "Scheduled",
        assignedTo: formData.assignedTo,
        assignedToName: assignedUser?.name || "",
        purpose: formData.purpose,
        notes: formData.notes,
        address: selectedLead.address || "",
        city: selectedLead.city || "",
        state: selectedLead.state || "",
        pincode: selectedLead.pincode || "",
        createdBy: "u2",
        createdAt: new Date(),
        updatedAt: new Date(),
        productsToDiscuss: selectedLead.interestedProducts || [],
      }

      dataStore.addVisit(newVisit)
      dataStore.updateLead(selectedLead.id, { status: "Visit Scheduled" })

      toast({ title: "Success", description: "Visit scheduled successfully" })
    }

    router.push("/dashboard/visits")
  }

  const qualifiedLeads = leads.filter((l) => l.status !== "Disqualified" && l.status !== "Lost")

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{visit ? "Edit Visit" : "Schedule Visit"}</CardTitle>
          <CardDescription>Fill in the essential details to schedule a visit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leadId">
              Customer <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.leadId}
              onValueChange={(value) => setFormData({ ...formData, leadId: value })}
              disabled={!!prefilledLeadId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {qualifiedLeads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.leadName} - {lead.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">
                Visit Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">
                Visit Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scheduledTime"
                type="time"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">
              Assign To <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((u) => u.role.includes("Sales") || u.role.includes("Field") || u.role.includes("Service"))
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">
              Purpose <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="purpose"
              required
              placeholder="What is the purpose of this visit?"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {visit ? "Update Visit" : "Schedule Visit"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
