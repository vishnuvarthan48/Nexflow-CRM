"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data-store"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const { tasks } = useDataStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log("[v0] TasksPage mounted")
    console.log("[v0] Tasks count:", tasks.length)
    console.log("[v0] Tasks data:", tasks)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && tasks.length === 0) {
      console.log("[v0] WARNING: No tasks found in data store")
      console.log("[v0] Checking localStorage...")
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("crm-data-store")
        if (stored) {
          const parsed = JSON.parse(stored)
          console.log("[v0] Tasks in localStorage:", parsed.tasks?.length || 0)
        }
      }
    }
  }, [mounted, tasks])

  if (!mounted) return null

  const openTasks = tasks.filter((t) => t.status === "Open" || t.status === "In Progress")
  const completedTasks = tasks.filter((t) => t.status === "Completed")

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "High":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "Medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Manage your assigned tasks and track progress</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "In Progress").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open & In Progress Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </div>
              {tasks.length === 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("crm-data-store")
                      window.location.reload()
                    }
                  }}
                >
                  Reload Sample Data
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {openTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No open tasks. Great job!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {openTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="mt-1">{getPriorityIcon(task.priority)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <Badge variant={task.status === "In Progress" ? "default" : "secondary"}>{task.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {task.entityType}: {task.entityId}
                        </span>
                        {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/${task.entityType.toLowerCase()}s/${task.entityId}`}>
                          <Button size="sm" variant="outline">
                            View {task.entityType}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
