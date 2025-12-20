"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import type { ServiceStatus } from "@/lib/types"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

const statusColors: Record<ServiceStatus, string> = {
  Requested: "bg-blue-100 text-blue-700",
  Scheduled: "bg-purple-100 text-purple-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
}

const priorityColors = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
}

export function ServiceRequestsList() {
  const { serviceRequests } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesSearch =
      request.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.productName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search service requests..."
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
              <SelectItem value="Requested">Requested</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Service Requests table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Ticket</th>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">Product</th>
                <th className="p-4 text-left text-sm font-medium">Issue Type</th>
                <th className="p-4 text-left text-sm font-medium">Priority</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Assigned To</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                    No service requests found
                  </td>
                </tr>
              ) : (
                sortedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{request.ticketNumber}</div>
                      <div className="text-xs text-muted-foreground">{format(request.createdAt, "MMM dd, yyyy")}</div>
                    </td>
                    <td className="p-4 text-sm">{request.customerName}</td>
                    <td className="p-4 text-sm">{request.productName}</td>
                    <td className="p-4">
                      <Badge variant="outline">{request.issueType}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={priorityColors[request.priority]} variant="secondary">
                        {request.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[request.status]} variant="secondary">
                        {request.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{request.assignedToName}</td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/service/${request.id}`}>
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
