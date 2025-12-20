"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import type { LeadStatus } from "@/lib/types"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-purple-100 text-purple-700",
  Qualified: "bg-green-100 text-green-700",
  "Visit Scheduled": "bg-orange-100 text-orange-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Lost: "bg-gray-100 text-gray-700",
}

export function LeadsList() {
  const { leads } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lead.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lead.companyName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lead.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lead.phone?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Visit Scheduled">Visit Scheduled</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Leads table/list */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Lead Name</th>
                <th className="p-4 text-left text-sm font-medium">Company</th>
                <th className="p-4 text-left text-sm font-medium">Contact</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Assigned To</th>
                <th className="p-4 text-left text-sm font-medium">Created</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{lead.leadName || `${lead.firstName} ${lead.lastName}`}</div>
                      <div className="text-sm text-muted-foreground">{lead.city}</div>
                    </td>
                    <td className="p-4 text-sm">{lead.companyName || "-"}</td>
                    <td className="p-4">
                      <div className="text-sm">{lead.email || "-"}</div>
                      <div className="text-sm text-muted-foreground">{lead.phone || "-"}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[lead.status]} variant="secondary">
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{lead.assignedTo || "-"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{format(lead.createdAt, "MMM dd, yyyy")}</td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
