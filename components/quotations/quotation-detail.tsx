"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { QuoteStatus } from "@/lib/types"
import { format } from "date-fns"
import { Calendar, User, FileText, CheckCircle, XCircle, Send, Edit } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const statusColors: Record<QuoteStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  "Pending Approval": "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  "Sent to Customer": "bg-blue-100 text-blue-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Declined: "bg-orange-100 text-orange-700",
}

export function QuotationDetail({ quotationId }: { quotationId: string }) {
  const { quotations, refresh } = useDataStore()
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionForm, setShowRejectionForm] = useState(false)

  const quotation = quotations.find((q) => q.id === quotationId)

  const handleStatusUpdate = (status: QuoteStatus) => {
    if (!quotation) return

    dataStore.updateQuotation(quotation.id, {
      status,
      approvedBy: status === "Approved" ? "u1" : undefined,
      approvedByName: status === "Approved" ? "Rajesh Kumar" : undefined,
      approvalDate: status === "Approved" ? new Date() : undefined,
      rejectionReason: status === "Rejected" ? rejectionReason : undefined,
    })

    dataStore.addActivity({
      id: `a${Date.now()}`,
      entityType: "Quotation",
      entityId: quotation.id,
      action: "Status Updated",
      description: `Quotation ${quotation.quoteNumber} ${status.toLowerCase()}`,
      userId: "u1",
      userName: "Rajesh Kumar",
      timestamp: new Date(),
    })

    setShowRejectionForm(false)
    setRejectionReason("")
    refresh()
  }

  const handleRequestApproval = () => {
    if (!quotation) return
    handleStatusUpdate("Pending Approval")
  }

  const handleReject = () => {
    if (!rejectionReason.trim()) return
    handleStatusUpdate("Rejected")
  }

  if (!quotation) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Quotation not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Quotation Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{quotation.quoteNumber}</CardTitle>
                <Badge className={statusColors[quotation.status]} variant="secondary">
                  {quotation.status}
                </Badge>
              </div>
              <CardDescription>{quotation.customerName}</CardDescription>
            </div>
            <div className="flex gap-2">
              {quotation.status === "Draft" && (
                <>
                  <Link href={`/dashboard/quotations/${quotationId}/edit`}>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button onClick={handleRequestApproval}>
                    <Send className="mr-2 h-4 w-4" />
                    Request Approval
                  </Button>
                </>
              )}
              {quotation.status === "Pending Approval" && (
                <>
                  <Button variant="outline" onClick={() => setShowRejectionForm(!showRejectionForm)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button onClick={() => handleStatusUpdate("Approved")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
              {quotation.status === "Approved" && (
                <Button onClick={() => handleStatusUpdate("Sent to Customer")}>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Customer
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Valid until: {format(quotation.validUntil, "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Created by: {quotation.createdByName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Created: {format(quotation.createdAt, "MMM dd, yyyy")}</span>
            </div>
            {quotation.approvedBy && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>
                  Approved by: {quotation.approvedByName} on {format(quotation.approvalDate!, "MMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>

          {/* Rejection Form */}
          {showRejectionForm && (
            <div className="rounded-lg border bg-red-50 p-4">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                rows={3}
                className="mt-2"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowRejectionForm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleReject} disabled={!rejectionReason.trim()}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}

          {/* Rejection Reason Display */}
          {quotation.status === "Rejected" && quotation.rejectionReason && (
            <div className="rounded-lg border bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
              <p className="text-sm text-red-700">{quotation.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-sm">
                  <th className="p-3 text-left font-medium">Product</th>
                  <th className="p-3 text-right font-medium">Qty</th>
                  <th className="p-3 text-right font-medium">Unit Price</th>
                  <th className="p-3 text-right font-medium">Discount</th>
                  <th className="p-3 text-right font-medium">Tax</th>
                  <th className="p-3 text-right font-medium">Final Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quotation.products.map((product, index) => (
                  <tr key={index} className="text-sm">
                    <td className="p-3">
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-xs text-muted-foreground">{product.manufacturer}</div>
                    </td>
                    <td className="p-3 text-right">{product.quantity}</td>
                    <td className="p-3 text-right">₹{product.unitPrice.toLocaleString()}</td>
                    <td className="p-3 text-right">{product.discount}%</td>
                    <td className="p-3 text-right">{product.tax}%</td>
                    <td className="p-3 text-right font-medium">₹{product.finalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs space-y-2 rounded-lg border bg-muted/50 p-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">₹{quotation.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span className="font-medium text-destructive">-₹{quotation.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span className="font-medium">₹{quotation.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>Total:</span>
                <span>₹{quotation.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="whitespace-pre-wrap text-sm">{quotation.terms}</p>
          </div>
          {quotation.notes && (
            <div>
              <p className="mb-2 text-sm font-medium">Notes:</p>
              <p className="text-sm text-muted-foreground">{quotation.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
