"use client"

import { Label } from "@/components/ui/label"

import type React from "react"
import { Input } from "@/components/ui/input"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { Visit, VisitStatus, VisitOutcomeStatus } from "@/lib/types"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const DEPARTMENTS = [
  "Cardiology",
  "Pulmonology",
  "Radiology",
  "Orthopedics",
  "Neurology",
  "General Medicine",
  "ICU",
  "Emergency",
  "Laboratory",
  "Administration",
  "Other",
]

interface VisitFormProps {
  visit?: Visit
  prefilledLeadId?: string
}

export function VisitForm({ visit, prefilledLeadId }: VisitFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { users, leads, itemsServices, companies } = useDataStore()

  const [visitCreationType, setVisitCreationType] = useState<"lead" | "direct">(
    visit?.leadId || prefilledLeadId ? "lead" : "direct",
  )

  const [showPOCDialog, setShowPOCDialog] = useState(false)
  const [showCompanyDialog, setShowCompanyDialog] = useState(false)
  const [newPOC, setNewPOC] = useState({ name: "", mobile: "", email: "" })
  const [newCompany, setNewCompany] = useState({ name: "", phone: "", email: "", city: "", state: "" })

  const [formData, setFormData] = useState({
    leadId: visit?.leadId || prefilledLeadId || "",
    customerName: visit?.customerName || "",
    pocName: visit?.pocName || "",
    pocMobile: visit?.pocMobile || "",
    pocEmail: visit?.pocEmail || "",
    department: visit?.department || "",
    visitType: visit?.visitType || ("Initial" as "Initial" | "Follow-up" | "Demo" | "Service"),
    scheduledDate: visit?.scheduledDate ? format(visit.scheduledDate, "yyyy-MM-dd") : "",
    scheduledTime: visit?.scheduledTime || "",
    status: visit?.status || ("Scheduled" as VisitStatus),
    assignedTo: visit?.assignedTo || "",
    purpose: visit?.purpose || "",
    productsToDiscuss: visit?.productsToDiscuss || [],
    address: visit?.address || "",
    city: visit?.city || "",
    state: visit?.state || "",
    pincode: visit?.pincode || "",
    notes: visit?.notes || "",
    outcome: visit?.outcome || "",
    outcomeStatus: visit?.outcomeStatus || ("" as VisitOutcomeStatus | ""),
    outcomeRemarks: visit?.outcomeRemarks || "",
    followUpRequired: visit?.followUpRequired || false,
    followUpDate: visit?.followUpDate ? format(visit.followUpDate, "yyyy-MM-dd") : "",
  })

  useEffect(() => {
    console.log("[v0] VisitForm mounted, users:", users.length, "leads:", leads.length, "companies:", companies.length)
    console.log("[v0] Visit:", visit, "PrefilledLeadId:", prefilledLeadId)

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)

      const scheduledDate = urlParams.get("scheduledDate")
      const purpose = urlParams.get("purpose")
      const productsToDiscuss = urlParams.get("productsToDiscuss")
      const visitType = urlParams.get("visitType")
      const previousVisitId = urlParams.get("previousVisitId")

      if (scheduledDate || purpose || visitType || previousVisitId) {
        console.log("[v0] Pre-filling from URL params:", { scheduledDate, purpose, visitType, previousVisitId })

        setFormData((prev) => ({
          ...prev,
          ...(scheduledDate && { scheduledDate }),
          ...(purpose && { purpose }),
          ...(visitType && { visitType: visitType as any }),
          ...(productsToDiscuss && { productsToDiscuss: productsToDiscuss.split(",").filter(Boolean) }),
        }))
      }
    }

    if (prefilledLeadId && !visit) {
      const lead = leads.find((l) => l.id === prefilledLeadId)
      console.log("[v0] Found lead for prefill:", lead)
      if (lead) {
        handleLeadChange(prefilledLeadId)
      }
    }
  }, [visit, prefilledLeadId, users.length, leads.length, companies.length])

  const qualifiedLeads = leads.filter((l) => l.status !== "Disqualified" && l.status !== "Lost")
  const activeProducts = itemsServices.filter((i) => i.isActive)

  console.log(
    "[v0] VisitForm rendering - Users:",
    users.length,
    "Leads:",
    qualifiedLeads.length,
    "Products:",
    activeProducts.length,
  )

  const handleLeadChange = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (lead) {
      setFormData({
        ...formData,
        leadId,
        customerName: lead.leadName,
        pocName: lead.leadName,
        pocMobile: lead.phone || "",
        pocEmail: lead.email || "",
        address: lead.address || "",
        city: lead.city || "",
        state: lead.state || "",
        pincode: lead.pincode || "",
        productsToDiscuss: lead.interestedProducts || [],
      })
    }
  }

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId)
    if (company) {
      setFormData({
        ...formData,
        customerName: company.name,
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        pincode: company.pincode || "",
      })
    }
  }

  const handleCreatePOC = () => {
    setFormData({
      ...formData,
      pocName: newPOC.name,
      pocMobile: newPOC.mobile,
      pocEmail: newPOC.email,
    })
    setShowPOCDialog(false)
    setNewPOC({ name: "", mobile: "", email: "" })
  }

  const handleCreateCompany = () => {
    const companyId = `comp${Date.now()}`
    dataStore.addCompany({
      id: companyId,
      name: newCompany.name,
      phone: newCompany.phone,
      email: newCompany.email,
      city: newCompany.city,
      state: newCompany.state,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    setFormData({
      ...formData,
      customerName: newCompany.name,
      city: newCompany.city,
      state: newCompany.state,
    })

    setShowCompanyDialog(false)
    setNewCompany({ name: "", phone: "", email: "", city: "", state: "" })
  }

  const handleProductToggle = (productId: string) => {
    const products = formData.productsToDiscuss.includes(productId)
      ? formData.productsToDiscuss.filter((p) => p !== productId)
      : [...formData.productsToDiscuss, productId]
    setFormData({ ...formData, productsToDiscuss: products })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const assignedUser = users.find((u) => u.id === formData.assignedTo)
    const lead = formData.leadId ? leads.find((l) => l.id === formData.leadId) : undefined

    if (visit) {
      // Update existing visit
      dataStore.updateVisit(visit.id, {
        ...formData,
        leadId: visitCreationType === "lead" ? formData.leadId : undefined,
        scheduledDate: new Date(formData.scheduledDate),
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
        assignedToName: assignedUser?.name || "",
        outcomeStatus: formData.outcomeStatus || undefined,
      })

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Visit",
        entityId: visit.id,
        action: "Updated",
        description: `Visit information updated`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    } else {
      const visitId = dataStore.generateVisitId()

      const newVisit: Visit = {
        id: visitId,
        ...formData,
        leadId: visitCreationType === "lead" ? formData.leadId : undefined,
        scheduledDate: new Date(formData.scheduledDate),
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
        assignedToName: assignedUser?.name || "",
        outcomeStatus: formData.outcomeStatus || undefined,
        createdBy: "u2",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.addVisit(newVisit)

      // Update lead status only if visit is based on lead
      if (visitCreationType === "lead" && lead) {
        dataStore.updateLead(lead.id, { status: "Visit Scheduled" })
      }

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Visit",
        entityId: newVisit.id,
        action: "Scheduled",
        description: `${formData.visitType} visit scheduled for ${formData.customerName}`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    }

    router.push("/dashboard/visits")
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{visit ? "Edit Visit" : "Schedule New Visit"}</CardTitle>
            <CardDescription>{visit ? "Update visit information" : "Schedule a visit with a customer"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!visit && !prefilledLeadId && (
              <div className="space-y-2">
                <Label>Visit Type</Label>
                <RadioGroup
                  value={visitCreationType}
                  onValueChange={(value: "lead" | "direct") => {
                    setVisitCreationType(value)
                    // Reset form when switching types
                    setFormData({
                      ...formData,
                      leadId: "",
                      customerName: "",
                      pocName: "",
                      pocMobile: "",
                      pocEmail: "",
                      address: "",
                      city: "",
                      state: "",
                      pincode: "",
                      productsToDiscuss: [],
                    })
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lead" id="lead" />
                    <Label htmlFor="lead" className="cursor-pointer font-normal">
                      Based on Lead
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct" className="cursor-pointer font-normal">
                      Direct Visit
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  {visitCreationType === "lead"
                    ? "Schedule a visit from an existing lead (auto-fills customer information)"
                    : "Schedule a direct visit without a lead (can be converted later)"}
                </p>
              </div>
            )}

            {/* Visit Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Visit Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {visitCreationType === "lead" ? (
                  <div className="space-y-2">
                    <Label htmlFor="leadId">Lead *</Label>
                    <Select value={formData.leadId} onValueChange={handleLeadChange} disabled={!!prefilledLeadId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead" />
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
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer/Company *</Label>
                    <div className="flex gap-2">
                      <Select value={formData.customerName} onValueChange={handleCompanyChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowCompanyDialog(true)}>
                        + New
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pocName">Point of Contact (POC) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pocName"
                      required
                      placeholder="POC Name"
                      value={formData.pocName}
                      onChange={(e) => setFormData({ ...formData, pocName: e.target.value })}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowPOCDialog(true)}>
                      + New
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pocMobile">POC Mobile *</Label>
                  <Input
                    id="pocMobile"
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.pocMobile}
                    onChange={(e) => setFormData({ ...formData, pocMobile: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pocEmail">POC Email *</Label>
                  <Input
                    id="pocEmail"
                    required
                    type="email"
                    placeholder="poc@company.com"
                    value={formData.pocEmail}
                    onChange={(e) => setFormData({ ...formData, pocEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitType">Visit Type *</Label>
                  <Select
                    value={formData.visitType}
                    onValueChange={(value: any) => setFormData({ ...formData, visitType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Initial">Initial</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Demo">Demo</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: VisitStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To *</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((u) => u.role.includes("Sales") || u.role.includes("Service"))
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {visitCreationType === "direct" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose *</Label>
                <Textarea
                  id="purpose"
                  required
                  rows={3}
                  placeholder="Describe the purpose of this visit..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Products/Services to Discuss</Label>
                <div className="rounded-lg border p-4 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {activeProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={formData.productsToDiscuss.includes(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                        <Label htmlFor={`product-${product.id}`} className="cursor-pointer font-normal">
                          {product.name} ({product.category})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Additional notes or preparation details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            {formData.status === "Completed" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Visit Outcome</h3>

                <div className="space-y-2">
                  <Label htmlFor="outcomeStatus">Outcome Status *</Label>
                  <Select
                    value={formData.outcomeStatus}
                    onValueChange={(value: VisitOutcomeStatus) => setFormData({ ...formData, outcomeStatus: value })}
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
                  <Label htmlFor="outcome">Outcome Details</Label>
                  <Textarea
                    id="outcome"
                    rows={4}
                    placeholder="Describe the outcome of the visit..."
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcomeRemarks">Remarks</Label>
                  <Textarea
                    id="outcomeRemarks"
                    rows={3}
                    placeholder="Additional remarks or comments..."
                    value={formData.outcomeRemarks}
                    onChange={(e) => setFormData({ ...formData, outcomeRemarks: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUpRequired"
                    checked={formData.followUpRequired}
                    onCheckedChange={(checked) => setFormData({ ...formData, followUpRequired: checked as boolean })}
                  />
                  <Label htmlFor="followUpRequired" className="cursor-pointer">
                    Follow-up required
                  </Label>
                </div>
                {formData.followUpRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">{visit ? "Update Visit" : "Schedule Visit"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* POC Dialog */}
      <Dialog open={showPOCDialog} onOpenChange={setShowPOCDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New POC</DialogTitle>
            <DialogDescription>Add a new point of contact for this visit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPOCName">POC Name *</Label>
              <Input
                id="newPOCName"
                placeholder="Full Name"
                value={newPOC.name}
                onChange={(e) => setNewPOC({ ...newPOC, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPOCMobile">Mobile *</Label>
              <Input
                id="newPOCMobile"
                type="tel"
                placeholder="+91 98765 43210"
                value={newPOC.mobile}
                onChange={(e) => setNewPOC({ ...newPOC, mobile: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPOCEmail">Email *</Label>
              <Input
                id="newPOCEmail"
                type="email"
                placeholder="poc@company.com"
                value={newPOC.email}
                onChange={(e) => setNewPOC({ ...newPOC, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowPOCDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreatePOC} disabled={!newPOC.name || !newPOC.mobile || !newPOC.email}>
              Create POC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Customer/Company</DialogTitle>
            <DialogDescription>Add a new customer for this visit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newCompanyName">Company Name *</Label>
              <Input
                id="newCompanyName"
                placeholder="Company Name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newCompanyPhone">Phone</Label>
              <Input
                id="newCompanyPhone"
                type="tel"
                placeholder="+91 98765 43210"
                value={newCompany.phone}
                onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newCompanyEmail">Email</Label>
              <Input
                id="newCompanyEmail"
                type="email"
                placeholder="company@example.com"
                value={newCompany.email}
                onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newCompanyCity">City</Label>
              <Input
                id="newCompanyCity"
                placeholder="City"
                value={newCompany.city}
                onChange={(e) => setNewCompany({ ...newCompany, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newCompanyState">State</Label>
              <Input
                id="newCompanyState"
                placeholder="State"
                value={newCompany.state}
                onChange={(e) => setNewCompany({ ...newCompany, state: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCompanyDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateCompany} disabled={!newCompany.name}>
              Create Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
