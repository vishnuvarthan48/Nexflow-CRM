"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import type { DemoStatus } from "@/lib/types"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

const statusColors: Record<DemoStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
}

export function DemosList() {
  const { demos } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredDemos = demos.filter((demo) => {
    const matchesSearch =
      demo.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || demo.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedDemos = [...filteredDemos].sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search demos..."
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
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Demos table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">Products</th>
                <th className="p-4 text-left text-sm font-medium">Scheduled</th>
                <th className="p-4 text-left text-sm font-medium">Location</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Assigned To</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedDemos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    No demos found
                  </td>
                </tr>
              ) : (
                sortedDemos.map((demo) => (
                  <tr key={demo.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{demo.customerName}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{demo.products.join(", ")}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{format(demo.scheduledDate, "MMM dd, yyyy")}</div>
                      <div className="text-sm text-muted-foreground">{demo.scheduledTime}</div>
                    </td>
                    <td className="p-4 text-sm">{demo.location}</td>
                    <td className="p-4">
                      <Badge className={statusColors[demo.status]} variant="secondary">
                        {demo.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{demo.assignedToName}</td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/demos/${demo.id}`}>
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
