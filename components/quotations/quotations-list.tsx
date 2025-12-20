"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/lib/data-store"
import type { QuoteStatus } from "@/lib/types"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"

const statusColors: Record<QuoteStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  "Pending Approval": "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  "Sent to Customer": "bg-blue-100 text-blue-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Declined: "bg-orange-100 text-orange-700",
}

export function QuotationsList() {
  const { quotations } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredQuotations = quotations.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedQuotations = [...filteredQuotations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
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
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Sent to Customer">Sent to Customer</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Quotations table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Quote Number</th>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">Amount</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Valid Until</th>
                <th className="p-4 text-left text-sm font-medium">Created</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedQuotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    No quotations found
                  </td>
                </tr>
              ) : (
                sortedQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{quote.quoteNumber}</div>
                    </td>
                    <td className="p-4 text-sm">{quote.customerName}</td>
                    <td className="p-4">
                      <div className="font-semibold">₹{quote.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{quote.products.length} items</div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[quote.status]} variant="secondary">
                        {quote.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{format(quote.validUntil, "MMM dd, yyyy")}</td>
                    <td className="p-4 text-sm text-muted-foreground">{format(quote.createdAt, "MMM dd, yyyy")}</td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/quotations/${quote.id}`}>
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
