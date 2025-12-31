"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Pencil, Building2 } from "lucide-react"
import { useDataStore } from "@/lib/data-store"
import Link from "next/link"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statusColors = {
  Active: "bg-green-100 text-green-700 hover:bg-green-100",
  Inactive: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  Suspended: "bg-red-100 text-red-700 hover:bg-red-100",
}

const planColors = {
  Free: "bg-blue-100 text-blue-700",
  Starter: "bg-purple-100 text-purple-700",
  Professional: "bg-orange-100 text-orange-700",
  Enterprise: "bg-pink-100 text-pink-700",
}

export function TenantsList() {
  const { tenants } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")

  const tenantsArray = tenants || []

  const filteredTenants = tenantsArray.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage all tenant organizations and subscriptions</p>
        </div>
        <Link href="/dashboard/tenants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Organization</th>
                <th className="p-4 text-left text-sm font-medium">Domain</th>
                <th className="p-4 text-left text-sm font-medium">Admin Contact</th>
                <th className="p-4 text-left text-sm font-medium">Plan</th>
                <th className="p-4 text-left text-sm font-medium">Users</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Last Login</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                    No tenants found
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tenant.companyCity}, {tenant.companyState}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-mono">{tenant.domain}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{tenant.adminName}</div>
                      <div className="text-sm text-muted-foreground">{tenant.adminEmail}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={planColors[tenant.plan]} variant="secondary">
                        {tenant.plan}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {tenant.currentUsers} / {tenant.maxUsers}
                      </div>
                      <div className="mt-1 h-1.5 w-20 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(tenant.currentUsers / tenant.maxUsers) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[tenant.status]} variant="secondary">
                        {tenant.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {tenant.lastLoginDate ? format(tenant.lastLoginDate, "MMM dd, yyyy") : "Never"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/tenants/${tenant.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/tenants/${tenant.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <div className="text-2xl font-bold">{tenantsArray.length}</div>
            <div className="text-sm text-muted-foreground">Total Tenants</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {tenantsArray.filter((t) => t.status === "Active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {tenantsArray.reduce((sum, t) => sum + t.currentUsers, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {tenantsArray.filter((t) => t.plan === "Enterprise").length}
            </div>
            <div className="text-sm text-muted-foreground">Enterprise Plans</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
