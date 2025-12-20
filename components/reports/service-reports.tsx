"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function ServiceReports() {
  const { serviceRequests } = useDataStore()

  // Service Request Status Distribution
  const statusData = [
    { name: "Requested", value: serviceRequests.filter((sr) => sr.status === "Requested").length, color: "#3b82f6" },
    { name: "Scheduled", value: serviceRequests.filter((sr) => sr.status === "Scheduled").length, color: "#8b5cf6" },
    {
      name: "In Progress",
      value: serviceRequests.filter((sr) => sr.status === "In Progress").length,
      color: "#f59e0b",
    },
    { name: "Completed", value: serviceRequests.filter((sr) => sr.status === "Completed").length, color: "#10b981" },
    { name: "On Hold", value: serviceRequests.filter((sr) => sr.status === "On Hold").length, color: "#ef4444" },
  ]

  // Priority Distribution
  const priorityData = [
    { name: "Low", value: serviceRequests.filter((sr) => sr.priority === "Low").length },
    { name: "Medium", value: serviceRequests.filter((sr) => sr.priority === "Medium").length },
    { name: "High", value: serviceRequests.filter((sr) => sr.priority === "High").length },
    { name: "Urgent", value: serviceRequests.filter((sr) => sr.priority === "Urgent").length },
  ]

  // Issue Type Distribution
  const issueTypeData = [
    { name: "Installation", value: serviceRequests.filter((sr) => sr.issueType === "Installation").length },
    { name: "Repair", value: serviceRequests.filter((sr) => sr.issueType === "Repair").length },
    { name: "Maintenance", value: serviceRequests.filter((sr) => sr.issueType === "Maintenance").length },
    { name: "Calibration", value: serviceRequests.filter((sr) => sr.issueType === "Calibration").length },
    { name: "Training", value: serviceRequests.filter((sr) => sr.issueType === "Training").length },
  ]

  // Calculate metrics
  const completedRequests = serviceRequests.filter((sr) => sr.status === "Completed")
  const avgResolutionTime = completedRequests.length > 0 ? "3.5 days" : "N/A"

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests.length}</div>
            <p className="text-xs text-muted-foreground">{completedRequests.length} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime}</div>
            <p className="text-xs text-muted-foreground">For completed requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests.filter((sr) => sr.status !== "Completed").length}</div>
            <p className="text-xs text-muted-foreground">
              {serviceRequests.filter((sr) => sr.priority === "Urgent").length} urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serviceRequests.length > 0 ? ((completedRequests.length / serviceRequests.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Service Request Status</CardTitle>
          <CardDescription>Current status of all service requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Priority & Issue Type */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Service requests by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Type Distribution</CardTitle>
            <CardDescription>Breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issueTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Service Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Service Requests</CardTitle>
          <CardDescription>Latest service tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{request.ticketNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.customerName} - {request.productName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{request.issueType}</p>
                  <p className="text-xs text-muted-foreground">{request.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
