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
import type { Demo, DemoStatus } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export function DemoForm({ demo }: { demo?: Demo }) {
  const router = useRouter()
  const { users, leads, quotations, products, refresh } = useDataStore()

  const [formData, setFormData] = useState({
    quotationId: demo?.quotationId || "",
    customerId: demo?.customerId || "",
    scheduledDate: demo?.scheduledDate ? format(demo.scheduledDate, "yyyy-MM-dd") : "",
    scheduledTime: demo?.scheduledTime || "",
    location: demo?.location || "",
    status: demo?.status || ("Scheduled" as DemoStatus),
    assignedTo: demo?.assignedTo || "",
    outcome: demo?.outcome || "",
    feedback: demo?.feedback || "",
  })

  const [selectedProducts, setSelectedProducts] = useState<string[]>(demo?.products || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const assignedUser = users.find((u) => u.id === formData.assignedTo)
    const lead = leads.find((l) => l.id === formData.customerId)

    if (demo) {
      // Update existing demo
      dataStore.updateDemo(demo.id, {
        ...formData,
        customerName: lead ? `${lead.customerName} - ${lead.companyName}` : demo.customerName,
        products: selectedProducts,
        scheduledDate: new Date(formData.scheduledDate),
        assignedToName: assignedUser?.name || "",
      })

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Demo",
        entityId: demo.id,
        action: "Updated",
        description: `Demo information updated`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    } else {
      // Create new demo
      const newDemo: Demo = {
        id: `d${Date.now()}`,
        ...formData,
        customerName: lead ? `${lead.customerName} - ${lead.companyName}` : "",
        products: selectedProducts,
        scheduledDate: new Date(formData.scheduledDate),
        assignedToName: assignedUser?.name || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.addDemo(newDemo)

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Demo",
        entityId: newDemo.id,
        action: "Scheduled",
        description: `Demo scheduled for ${lead?.customerName}`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    }

    refresh()
    router.push("/dashboard/demos")
  }

  const approvedQuotations = quotations.filter((q) => q.status === "Approved" || q.status === "Sent to Customer")

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{demo ? "Edit Demo" : "Schedule New Demo"}</CardTitle>
          <CardDescription>{demo ? "Update demo information" : "Schedule a product demonstration"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Demo Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quotationId">Quotation (Optional)</Label>
                <Select
                  value={formData.quotationId}
                  onValueChange={(value) => {
                    const quote = quotations.find((q) => q.id === value)
                    setFormData({
                      ...formData,
                      quotationId: value,
                      customerId: quote?.customerId || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quotation" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedQuotations.map((quote) => (
                      <SelectItem key={quote.id} value={quote.id}>
                        {quote.quoteNumber} - {quote.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.customerName} - {lead.companyName}
                      </SelectItem>
                    ))}
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
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  placeholder="e.g., Customer site, Office"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: DemoStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To *</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((u) => u.role.includes("Sales"))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-2">
              <Label>Products to Demonstrate *</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={product.id}
                      checked={selectedProducts.includes(product.modelName)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts([...selectedProducts, product.modelName])
                        } else {
                          setSelectedProducts(selectedProducts.filter((p) => p !== product.modelName))
                        }
                      }}
                    />
                    <Label htmlFor={product.id} className="cursor-pointer text-sm">
                      {product.modelName}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outcome (for completed demos) */}
          {formData.status === "Completed" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Demo Outcome</h3>
              <div className="space-y-2">
                <Label htmlFor="outcome">Outcome</Label>
                <Textarea
                  id="outcome"
                  rows={4}
                  placeholder="Describe the outcome of the demo..."
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Customer Feedback</Label>
                <Textarea
                  id="feedback"
                  rows={4}
                  placeholder="Customer feedback and comments..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">{demo ? "Update Demo" : "Schedule Demo"}</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
