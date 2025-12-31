"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDataStore } from "@/lib/data-store"
import { Calendar, MapPin, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function VisitActivityOverview() {
  const { visits } = useDataStore()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const todayVisits = visits.filter((v) => {
    const visitDate = new Date(v.scheduledDate)
    visitDate.setHours(0, 0, 0, 0)
    return visitDate.getTime() === today.getTime()
  })

  const upcomingVisits = visits.filter((v) => {
    const visitDate = new Date(v.scheduledDate)
    visitDate.setHours(0, 0, 0, 0)
    return visitDate > today && visitDate <= nextWeek && ["Scheduled", "Confirmed"].includes(v.status)
  })

  const rescheduledVisits = visits.filter((v) => v.status === "Rescheduled")

  const missedVisits = visits.filter((v) => v.status === "Missed")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500"
      case "Confirmed":
        return "bg-green-500"
      case "Rescheduled":
        return "bg-amber-500"
      case "Missed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Visit & Field Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Visits */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Today's Visits
            </h4>
            <Badge className="bg-blue-500">{todayVisits.length}</Badge>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {todayVisits.map((visit) => (
              <Link
                key={visit.id}
                href={`/dashboard/visits/${visit.id}`}
                className="block border rounded-lg p-3 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{visit.customerName}</p>
                    <p className="text-xs text-muted-foreground">{visit.purpose}</p>
                  </div>
                  <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                </div>
              </Link>
            ))}
            {todayVisits.length === 0 && <p className="text-sm text-muted-foreground">No visits scheduled today</p>}
          </div>
        </div>

        {/* Upcoming Visits */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Upcoming (Next 7 Days)
            </h4>
            <Badge className="bg-green-500">{upcomingVisits.length}</Badge>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {upcomingVisits.slice(0, 3).map((visit) => (
              <div key={visit.id} className="text-sm border-l-2 border-green-500 pl-3 py-1">
                <p className="font-medium">{visit.customerName}</p>
                <p className="text-xs text-muted-foreground">{new Date(visit.scheduledDate).toLocaleDateString()}</p>
              </div>
            ))}
            {upcomingVisits.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming visits scheduled</p>
            )}
          </div>
        </div>

        {/* Issue Flags */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-xs font-semibold text-amber-700">Rescheduled</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{rescheduledVisits.length}</p>
          </div>
          <div className="border border-red-200 bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-xs font-semibold text-red-700">Missed</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{missedVisits.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
