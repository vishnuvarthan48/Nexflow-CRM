"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data-store"
import { CheckSquare } from "lucide-react"
import Link from "next/link"

export function TaskOverview() {
  const { tasks } = useDataStore()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueToday = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime() && t.status !== "Completed"
  })

  const overdue = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && t.status !== "Completed"
  })

  const byRole = {
    CCE: tasks.filter((t) => t.assignedTo === "usr1" && t.status !== "Completed").length,
    FE: tasks.filter((t) => t.assignedTo === "usr2" && t.status !== "Completed").length,
    Manager: tasks.filter((t) => t.assignedTo === "usr3" && t.status !== "Completed").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-blue-500" />
          Task Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-700 mb-1">Due Today</p>
            <p className="text-2xl font-bold text-blue-600">{dueToday.length}</p>
          </div>
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <p className="text-xs font-medium text-red-700 mb-1">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{overdue.length}</p>
          </div>
        </div>

        {/* Tasks Due Today */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Tasks Due Today</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {dueToday.slice(0, 3).map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/tasks`}
                className="block text-sm border-l-2 border-blue-500 pl-3 py-2 hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  Priority: {task.priority} • Assigned to: {task.assignedToName}
                </p>
              </Link>
            ))}
            {dueToday.length === 0 && <p className="text-sm text-muted-foreground">No tasks due today</p>}
          </div>
        </div>

        {/* By Role */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Tasks by Role</h4>
          <div className="space-y-2">
            {Object.entries(byRole).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{role}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
