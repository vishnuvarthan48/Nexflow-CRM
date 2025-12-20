"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function SalesReports() {
  const { leads, quotations, demos, visits } = useDataStore()

  // Lead Status Distribution
  const leadStatusData = [
    { name: "New", value: leads.filter((l) => l.status === "New").length, color: "#3b82f6" },
    { name: "Contacted", value: leads.filter((l) => l.status === "Contacted").length, color: "#8b5cf6" },
    { name: "Qualified", value: leads.filter((l) => l.status === "Qualified").length, color: "#10b981" },
    { name: "Visit Scheduled", value: leads.filter((l) => l.status === "Visit Scheduled").length, color: "#f59e0b" },
    { name: "Converted", value: leads.filter((l) => l.status === "Converted").length, color: "#059669" },
    { name: "Lost", value: leads.filter((l) => l.status === "Lost").length, color: "#6b7280" },
  ]

  // Quote Status Distribution
  const quoteStatusData = [
    { name: "Draft", value: quotations.filter((q) => q.status === "Draft").length },
    { name: "Pending Approval", value: quotations.filter((q) => q.status === "Pending Approval").length },
    { name: "Approved", value: quotations.filter((q) => q.status === "Approved").length },
    { name: "Sent to Customer", value: quotations.filter((q) => q.status === "Sent to Customer").length },
    { name: "Accepted", value: quotations.filter((q) => q.status === "Accepted").length },
  ]

  // Revenue by Price Category
  const revenueByCategoryData = [
    {
      category: "Category A",
      revenue:
        quotations
          .filter((q) => q.status === "Approved" || q.status === "Sent to Customer")
          .reduce((sum, q) => sum + q.totalAmount, 0) * 0.3,
    },
    {
      category: "Category B",
      revenue:
        quotations
          .filter((q) => q.status === "Approved" || q.status === "Sent to Customer")
          .reduce((sum, q) => sum + q.totalAmount, 0) * 0.25,
    },
    {
      category: "Category C",
      revenue:
        quotations
          .filter((q) => q.status === "Approved" || q.status === "Sent to Customer")
          .reduce((sum, q) => sum + q.totalAmount, 0) * 0.2,
    },
    {
      category: "Category D",
      revenue:
        quotations
          .filter((q) => q.status === "Approved" || q.status === "Sent to Customer")
          .reduce((sum, q) => sum + q.totalAmount, 0) * 0.15,
    },
    {
      category: "Category E",
      revenue:
        quotations
          .filter((q) => q.status === "Approved" || q.status === "Sent to Customer")
          .reduce((sum, q) => sum + q.totalAmount, 0) * 0.1,
    },
  ]

  // Visit Success Rate
  const completedVisits = visits.filter((v) => v.status === "Completed")
  const visitsWithFollowup = completedVisits.filter((v) => v.followUpRequired)

  // Demo Conversion
  const completedDemos = demos.filter((d) => d.status === "Completed")

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length > 0
                ? ((leads.filter((l) => l.status === "Converted").length / leads.length) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {leads.filter((l) => l.status === "Converted").length} / {leads.length} leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Quote Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {quotations.length > 0
                ? (quotations.reduce((sum, q) => sum + q.totalAmount, 0) / quotations.length).toFixed(0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">{quotations.length} total quotes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visit Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedVisits.length > 0
                ? (((completedVisits.length - visitsWithFollowup.length) / completedVisits.length) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">{completedVisits.length} completed visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Demo Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDemos.length}</div>
            <p className="text-xs text-muted-foreground">
              {demos.filter((d) => d.status === "Scheduled").length} scheduled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Status Distribution</CardTitle>
          <CardDescription>Current status of all leads in the pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quote Status & Revenue */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quotation Pipeline</CardTitle>
            <CardDescription>Status of all quotations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quoteStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Price Category</CardTitle>
            <CardDescription>Estimated revenue distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Products */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Summary</CardTitle>
          <CardDescription>Overview of all quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotations.slice(0, 5).map((quote) => (
              <div key={quote.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{quote.quoteNumber}</p>
                  <p className="text-sm text-muted-foreground">{quote.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{quote.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{quote.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
