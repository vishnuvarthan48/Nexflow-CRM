"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import type { VisitStatus } from "@/lib/types"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

const statusColors: Record<VisitStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Confirmed: "bg-green-100 text-green-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-orange-100 text-orange-700",
}

export function VisitsList() {
  const { visits, leads } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredVisits = visits.filter((visit) => {
    const lead = leads.find((l) => l.id === visit.leadId)
    const customerName = visit.customerName || lead?.leadName || ""
    const matchesSearch =
      (customerName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (visit.purpose?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (visit.assignedToName?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || visit.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort by scheduled date
  const sortedVisits = [...filteredVisits].sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search visits..."
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
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Visits table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Visit ID</th>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">Visit Type</th>
                <th className="p-4 text-left text-sm font-medium">Scheduled</th>
                <th className="p-4 text-left text-sm font-medium">Purpose</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Assigned To</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedVisits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                    No visits found
                  </td>
                </tr>
              ) : (
                sortedVisits.map((visit) => {
                  const lead = leads.find((l) => l.id === visit.leadId)
                  const customerName = visit.customerName || lead?.leadName || "Unknown"
                  const companyName = lead?.companyName || visit.customerName || "-"

                  return (
                    <tr key={visit.id} className="hover:bg-muted/50">
                      <td className="p-4">
                        <div className="text-sm font-mono">{visit.id}</div>
                        {!visit.leadId && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Direct
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{customerName}</div>
                        <div className="text-sm text-muted-foreground">{companyName}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{visit.visitType}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{format(visit.scheduledDate, "MMM dd, yyyy")}</div>
                        <div className="text-sm text-muted-foreground">{visit.scheduledTime}</div>
                      </td>
                      <td className="p-4 text-sm">{visit.purpose}</td>
                      <td className="p-4">
                        <Badge className={statusColors[visit.status]} variant="secondary">
                          {visit.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{visit.assignedToName}</td>
                      <td className="p-4 text-right">
                        <Link href={`/dashboard/visits/${visit.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
