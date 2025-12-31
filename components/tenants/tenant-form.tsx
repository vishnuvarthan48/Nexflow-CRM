"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useDataStore } from "@/lib/data-store"
import type { Tenant } from "@/lib/types"

interface TenantFormProps {
  tenant?: Tenant
  isEdit?: boolean
}

export function TenantForm({ tenant, isEdit = false }: TenantFormProps) {
  const router = useRouter()
  const { addTenant, updateTenant } = useDataStore()

  const [formData, setFormData] = useState({
    name: tenant?.name || "",
    domain: tenant?.domain || "",
    adminName: tenant?.adminName || "",
    adminEmail: tenant?.adminEmail || "",
    adminPhone: tenant?.adminPhone || "",
    companyAddress: tenant?.companyAddress || "",
    companyCity: tenant?.companyCity || "",
    companyState: tenant?.companyState || "",
    companyZip: tenant?.companyZip || "",
    plan: tenant?.plan || "Free",
    maxUsers: tenant?.maxUsers || 5,
    status: tenant?.status || "Active",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Organization name is required"
    if (!formData.domain.trim()) newErrors.domain = "Domain is required"
    if (!formData.adminName.trim()) newErrors.adminName = "Admin name is required"
    if (!formData.adminEmail.trim()) newErrors.adminEmail = "Admin email is required"
    if (!formData.adminPhone.trim()) newErrors.adminPhone = "Admin phone is required"
    if (!formData.companyAddress.trim()) newErrors.companyAddress = "Address is required"
    if (!formData.companyCity.trim()) newErrors.companyCity = "City is required"
    if (!formData.companyState.trim()) newErrors.companyState = "State is required"
    if (!formData.companyZip.trim()) newErrors.companyZip = "ZIP code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const tenantData: Tenant = {
      id: tenant?.id || `tenant-${Date.now()}`,
      ...formData,
      maxUsers: Number(formData.maxUsers),
      currentUsers: tenant?.currentUsers || 0,
      createdDate: tenant?.createdDate || new Date(),
      lastLoginDate: tenant?.lastLoginDate || null,
    }

    if (isEdit && tenant) {
      updateTenant(tenant.id, tenantData)
    } else {
      addTenant(tenantData)
    }

    router.push("/dashboard/tenants")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Organization Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Apollo Hospitals"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              placeholder="e.g., apollo.nexflow.com"
            />
            {errors.domain && <p className="text-sm text-red-600">{errors.domain}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Admin Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adminName">Admin Name *</Label>
            <Input
              id="adminName"
              value={formData.adminName}
              onChange={(e) => handleChange("adminName", e.target.value)}
              placeholder="e.g., Dr. Rajesh Kumar"
            />
            {errors.adminName && <p className="text-sm text-red-600">{errors.adminName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email *</Label>
            <Input
              id="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              placeholder="admin@hospital.com"
            />
            {errors.adminEmail && <p className="text-sm text-red-600">{errors.adminEmail}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPhone">Admin Phone *</Label>
            <Input
              id="adminPhone"
              value={formData.adminPhone}
              onChange={(e) => handleChange("adminPhone", e.target.value)}
              placeholder="+91-9876543210"
            />
            {errors.adminPhone && <p className="text-sm text-red-600">{errors.adminPhone}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Company Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="companyAddress">Street Address *</Label>
            <Input
              id="companyAddress"
              value={formData.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              placeholder="123 Medical Center Road"
            />
            {errors.companyAddress && <p className="text-sm text-red-600">{errors.companyAddress}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCity">City *</Label>
            <Input
              id="companyCity"
              value={formData.companyCity}
              onChange={(e) => handleChange("companyCity", e.target.value)}
              placeholder="Mumbai"
            />
            {errors.companyCity && <p className="text-sm text-red-600">{errors.companyCity}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyState">State *</Label>
            <Input
              id="companyState"
              value={formData.companyState}
              onChange={(e) => handleChange("companyState", e.target.value)}
              placeholder="Maharashtra"
            />
            {errors.companyState && <p className="text-sm text-red-600">{errors.companyState}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyZip">ZIP Code *</Label>
            <Input
              id="companyZip"
              value={formData.companyZip}
              onChange={(e) => handleChange("companyZip", e.target.value)}
              placeholder="400001"
            />
            {errors.companyZip && <p className="text-sm text-red-600">{errors.companyZip}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Subscription Details</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="plan">Subscription Plan</Label>
            <Select value={formData.plan} onValueChange={(value) => handleChange("plan", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUsers">Max Users</Label>
            <Input
              id="maxUsers"
              type="number"
              value={formData.maxUsers}
              onChange={(e) => handleChange("maxUsers", Number.parseInt(e.target.value) || 0)}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Update Tenant" : "Create Tenant"}</Button>
      </div>
    </form>
  )
}
