"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data-store"
import { AlertCircle, Clock, Calendar } from "lucide-react"
import Link from "next/link"

export function FollowUpRisk() {
  const { leads, tasks } = useDataStore()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const overdueTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && t.status !== "Completed"
  })

  const dueTodayTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime() && t.status !== "Completed"
  })

  const dueThisWeekTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    return dueDate > today && dueDate <= weekFromNow && t.status !== "Completed"
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Follow-up & Risk Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue */}
        <div className="border-l-4 border-red-500 pl-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Overdue Follow-ups
            </h4>
            <Badge variant="destructive">{overdueTasks.length}</Badge>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {overdueTasks.slice(0, 3).map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/${task.entityType?.toLowerCase()}s/${task.entityId}`}
                className="block text-sm hover:bg-red-50 p-2 rounded transition-colors"
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </Link>
            ))}
            {overdueTasks.length === 0 && <p className="text-sm text-muted-foreground">No overdue items</p>}
          </div>
        </div>

        {/* Due Today */}
        <div className="border-l-4 border-amber-500 pl-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-amber-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Due Today
            </h4>
            <Badge className="bg-amber-500">{dueTodayTasks.length}</Badge>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {dueTodayTasks.slice(0, 3).map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/${task.entityType?.toLowerCase()}s/${task.entityId}`}
                className="block text-sm hover:bg-amber-50 p-2 rounded transition-colors"
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">Priority: {task.priority}</p>
              </Link>
            ))}
            {dueTodayTasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks due today</p>}
          </div>
        </div>

        {/* Due This Week */}
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due This Week
            </h4>
            <Badge className="bg-blue-500">{dueThisWeekTasks.length}</Badge>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {dueThisWeekTasks.slice(0, 3).map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/${task.entityType?.toLowerCase()}s/${task.entityId}`}
                className="block text-sm hover:bg-blue-50 p-2 rounded transition-colors"
              >
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </Link>
            ))}
            {dueThisWeekTasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks due this week</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
