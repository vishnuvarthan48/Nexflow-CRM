"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { Lead, LeadStatus, LeadType, PreferredContactMethod } from "@/lib/types"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function LeadForm({ lead }: { lead?: Lead }) {
  const router = useRouter()
  const { users, companies, itemsServices, refresh } = useDataStore() // Added itemsServices
  const [mounted, setMounted] = useState(false)
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState("")

  const [selectedItems, setSelectedItems] = useState<string[]>(lead?.interestedProducts || [])
  const [showItemsDropdown, setShowItemsDropdown] = useState(false)

  const [formData, setFormData] = useState({
    // Mandatory
    firstName: lead?.firstName || "",
    lastName: lead?.lastName || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    status: lead?.status || ("New" as LeadStatus),
    assignedTo: lead?.assignedTo || "",

    // Highly Recommended
    leadName: lead?.leadName || "",
    source: lead?.source || "",

    // Important
    companyName: lead?.companyName || "",
    industry: lead?.industry || "",
    leadType: lead?.leadType || ("" as LeadType | ""),
    leadScore: lead?.leadScore?.toString() || "",
    preferredContactMethod: lead?.preferredContactMethod || ("" as PreferredContactMethod | ""),
    nextFollowUpDate: lead?.nextFollowUpDate ? lead.nextFollowUpDate.toISOString().split("T")[0] : "",

    // Contact
    alternatePhone: lead?.alternatePhone || "",
    secondaryEmail: lead?.secondaryEmail || "",

    // Company/Address
    website: lead?.website || "",
    address: lead?.address || "",
    city: lead?.city || "",
    state: lead?.state || "",
    pincode: lead?.pincode || "",

    // Additional
    annualRevenue: lead?.annualRevenue || "",
    employeeCount: lead?.employeeCount || "",
    notes: lead?.notes || "",

    // Introducer/Broker
    introducerName: lead?.introducerName || "",
    introducerCompany: lead?.introducerCompany || "",
    introducerContact: lead?.introducerContact || "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (formData.firstName || formData.lastName) {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      setFormData((prev) => ({ ...prev, leadName: fullName }))
    }
  }, [formData.firstName, formData.lastName])

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email && !formData.phone) {
      alert("Please provide at least one contact method (Email or Phone)")
      return
    }

    const assignedUser = formData.assignedTo ? users.find((u) => u.id === formData.assignedTo) : undefined

    if (lead) {
      // Update existing lead
      dataStore.updateLead(lead.id, {
        ...formData,
        leadScore: formData.leadScore ? Number.parseInt(formData.leadScore) : undefined,
        nextFollowUpDate: formData.nextFollowUpDate ? new Date(formData.nextFollowUpDate) : undefined,
        interestedProducts: selectedItems, // Use selectedItems instead
        assignedToName: assignedUser?.name || "",
        leadType: formData.leadType || undefined,
        preferredContactMethod: formData.preferredContactMethod || undefined,
      })

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Lead",
        entityId: lead.id,
        action: "Updated",
        description: `Lead information updated`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    } else {
      const year = new Date().getFullYear()
      const leadCount = dataStore.getLeads().length + 1
      const leadId = `LD-${year}-${leadCount.toString().padStart(4, "0")}`

      const newLead: Lead = {
        id: leadId,
        ...formData,
        leadScore: formData.leadScore ? Number.parseInt(formData.leadScore) : undefined,
        nextFollowUpDate: formData.nextFollowUpDate ? new Date(formData.nextFollowUpDate) : undefined,
        interestedProducts: selectedItems, // Use selectedItems instead
        assignedToName: assignedUser?.name || "",
        leadType: (formData.leadType || undefined) as LeadType | undefined,
        preferredContactMethod: (formData.preferredContactMethod || undefined) as PreferredContactMethod | undefined,
        createdBy: "u2",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.addLead(newLead)

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Lead",
        entityId: newLead.id,
        action: "Created",
        description: `New lead created: ${formData.leadName}`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    }

    refresh()
    router.push("/dashboard/leads")
  }

  const handleAddNewCompany = () => {
    if (newCompanyName.trim()) {
      const newCompany = {
        id: `c${Date.now()}`,
        name: newCompanyName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      dataStore.addCompany(newCompany)
      setFormData({ ...formData, companyName: newCompany.name })
      setNewCompanyName("")
      setShowNewCompanyDialog(false)
      refresh()
    }
  }

  const salesUsers = users.filter((u) => u.role.includes("Sales"))

  const activeItemsServices = itemsServices.filter((item) => item.isActive)
  const selectedItemsData = activeItemsServices.filter((item) => selectedItems.includes(item.id))

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{lead ? "Edit Lead" : "Create New Lead"}</CardTitle>
            <CardDescription>
              {lead
                ? "Update lead information"
                : "Enter the details of the new lead. Fields marked with * are mandatory."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Mandatory Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="At least one: Email or Phone required"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile</Label>
                  <Input
                    id="phone"
                    placeholder="At least one: Email or Phone required"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Lead Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: LeadStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Visit Scheduled">Visit Scheduled</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To / Lead Owner</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Highly Recommended</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="leadName">Lead Name (Auto-generated)</Label>
                  <Input
                    id="leadName"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    placeholder="Auto-filled from First + Last Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Website, Trade Show, Referral"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Important Fields</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.companyName}
                      onValueChange={(value) => {
                        if (value === "__add_new__") {
                          setShowNewCompanyDialog(true)
                        } else {
                          setFormData({ ...formData, companyName: value })
                        }
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_new__" className="text-primary">
                          <div className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Company
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Healthcare, Manufacturing"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadType">Lead Type</Label>
                  <Select
                    value={formData.leadType}
                    onValueChange={(value: LeadType) => setFormData({ ...formData, leadType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cold">Cold</SelectItem>
                      <SelectItem value="Warm">Warm</SelectItem>
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Existing Customer">Existing Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadScore">Lead Score (0-100)</Label>
                  <Input
                    id="leadScore"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={formData.leadScore}
                    onChange={(e) => setFormData({ ...formData, leadScore: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                  <Select
                    value={formData.preferredContactMethod}
                    onValueChange={(value: PreferredContactMethod) =>
                      setFormData({ ...formData, preferredContactMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
                  <Input
                    id="nextFollowUpDate"
                    type="date"
                    value={formData.nextFollowUpDate}
                    onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryEmail">Secondary Email</Label>
                  <Input
                    id="secondaryEmail"
                    type="email"
                    value={formData.secondaryEmail}
                    onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company & Address</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="www.example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Introducer/Broker Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="introducerName">Introducer Name</Label>
                  <Input
                    id="introducerName"
                    value={formData.introducerName}
                    onChange={(e) => setFormData({ ...formData, introducerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="introducerCompany">Introducer Company</Label>
                  <Input
                    id="introducerCompany"
                    value={formData.introducerCompany}
                    onChange={(e) => setFormData({ ...formData, introducerCompany: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="introducerContact">Introducer Contact</Label>
                  <Input
                    id="introducerContact"
                    value={formData.introducerContact}
                    onChange={(e) => setFormData({ ...formData, introducerContact: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interested Items/Services</h3>
              <div className="space-y-2">
                <Label>Select Items/Services (Multi-select)</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowItemsDropdown(!showItemsDropdown)}
                  >
                    {selectedItems.length === 0 ? "Select items/services..." : `${selectedItems.length} selected`}
                  </Button>

                  {showItemsDropdown && (
                    <Card className="absolute z-10 mt-2 max-h-80 w-full overflow-auto">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {activeItemsServices.map((item) => (
                            <div key={item.id} className="flex items-start space-x-2">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => handleItemToggle(item.id)}
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={`item-${item.id}`}
                                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.name}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {item.category} {item.subCategory ? `- ${item.subCategory}` : ""}
                                </p>
                              </div>
                            </div>
                          ))}
                          {activeItemsServices.length === 0 && (
                            <p className="text-sm text-muted-foreground">No items/services available</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-4 w-full"
                          onClick={() => setShowItemsDropdown(false)}
                        >
                          Done
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Display selected items */}
                {selectedItemsData.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItemsData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        <span>{item.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Notes</h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or comments about this lead..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{lead ? "Update Lead" : "Create Lead"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/leads")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Dialog open={showNewCompanyDialog} onOpenChange={setShowNewCompanyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>Enter the name of the new company</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newCompanyName">Company Name</Label>
              <Input
                id="newCompanyName"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCompanyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewCompany}>Add Company</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
