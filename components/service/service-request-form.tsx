"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { ServiceRequest, ServiceStatus } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export function ServiceRequestForm({ serviceRequest }: { serviceRequest?: ServiceRequest }) {
  const router = useRouter()
  const { users, leads, products, refresh } = useDataStore()

  const [formData, setFormData] = useState({
    customerId: serviceRequest?.customerId || "",
    productId: serviceRequest?.productId || "",
    issueType:
      serviceRequest?.issueType ||
      ("Installation" as "Installation" | "Repair" | "Maintenance" | "Calibration" | "Training"),
    priority: serviceRequest?.priority || ("Medium" as "Low" | "Medium" | "High" | "Urgent"),
    description: serviceRequest?.description || "",
    status: serviceRequest?.status || ("Requested" as ServiceStatus),
    assignedTo: serviceRequest?.assignedTo || "",
    scheduledDate: serviceRequest?.scheduledDate ? format(serviceRequest.scheduledDate, "yyyy-MM-dd") : "",
    resolution: serviceRequest?.resolution || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const assignedUser = users.find((u) => u.id === formData.assignedTo)
    const lead = leads.find((l) => l.id === formData.customerId)
    const product = products.find((p) => p.id === formData.productId)

    if (serviceRequest) {
      // Update existing service request
      dataStore.updateServiceRequest(serviceRequest.id, {
        ...formData,
        customerName: lead?.companyName || serviceRequest.customerName,
        productName: product?.modelName || serviceRequest.productName,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        assignedToName: assignedUser?.name || "",
      })

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Service",
        entityId: serviceRequest.id,
        action: "Updated",
        description: `Service request ${serviceRequest.ticketNumber} updated`,
        userId: "u3",
        userName: "Amit Patel",
        timestamp: new Date(),
      })
    } else {
      // Create new service request
      const ticketNumber = `SRV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

      const newServiceRequest: ServiceRequest = {
        id: `s${Date.now()}`,
        ticketNumber,
        customerId: formData.customerId,
        customerName: lead?.companyName || "",
        productId: formData.productId,
        productName: product?.modelName || "",
        issueType: formData.issueType,
        priority: formData.priority,
        description: formData.description,
        status: formData.status,
        assignedTo: formData.assignedTo,
        assignedToName: assignedUser?.name || "",
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.addServiceRequest(newServiceRequest)

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Service",
        entityId: newServiceRequest.id,
        action: "Created",
        description: `Service request ${ticketNumber} created for ${lead?.companyName}`,
        userId: "u3",
        userName: "Amit Patel",
        timestamp: new Date(),
      })
    }

    refresh()
    router.push("/dashboard/service")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{serviceRequest ? "Edit Service Request" : "New Service Request"}</CardTitle>
          <CardDescription>
            {serviceRequest ? "Update service request information" : "Create a new service request"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Request Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
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
                        {lead.companyName} - {lead.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productId">Product *</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.modelName} - {product.manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type *</Label>
                <Select
                  value={formData.issueType}
                  onValueChange={(value: any) => setFormData({ ...formData, issueType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Installation">Installation</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Calibration">Calibration</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ServiceStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Requested">Requested</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
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
                      .filter((u) => u.role.includes("Service"))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.status === "Scheduled" && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Resolution */}
          {formData.status === "Completed" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resolution</h3>
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Details</Label>
                <Textarea
                  id="resolution"
                  rows={4}
                  placeholder="Describe how the issue was resolved..."
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">{serviceRequest ? "Update Request" : "Create Request"}</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
