"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/lib/data-store"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PendingApprovals() {
  const { quotations } = useDataStore()

  const pendingQuotes = quotations.filter((q) => q.status === "Pending Approval").slice(0, 4)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Approvals</CardTitle>
        <Link href="/dashboard/quotations">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingQuotes.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No pending approvals</p>
          ) : (
            pendingQuotes.map((quote) => (
              <Link key={quote.id} href={`/dashboard/quotations/${quote.id}`}>
                <div className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-accent">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{quote.quoteNumber}</p>
                    <Badge variant="secondary">{quote.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{quote.customerName}</p>
                  <p className="text-sm font-semibold">₹{quote.totalAmount.toLocaleString()}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
