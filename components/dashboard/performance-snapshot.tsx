"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store"
import { TrendingUp } from "lucide-react"

export function PerformanceSnapshot() {
  const { leads, quotations, users } = useDataStore()

  const salespeople = users.filter((u) => u.role === "Sales Executive" || u.role === "Field Executive")

  const performanceData = salespeople.map((person) => {
    const personLeads = leads.filter((l) => l.assignedTo === person.id)
    const converted = personLeads.filter((l) => l.status === "Converted").length
    const personQuotes = quotations.filter((q) => q.salesRepId === person.id)
    const poReceived = personQuotes.filter((q) => q.status === "PO Received").length

    return {
      name: person.name,
      leadCount: personLeads.length,
      conversionRate: personLeads.length > 0 ? ((converted / personLeads.length) * 100).toFixed(1) : "0",
      quoteToPO: personQuotes.length > 0 ? ((poReceived / personQuotes.length) * 100).toFixed(1) : "0",
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Performance Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Salesperson</th>
                <th className="text-center py-3 px-2 font-semibold">Lead Count</th>
                <th className="text-center py-3 px-2 font-semibold">Conversion %</th>
                <th className="text-center py-3 px-2 font-semibold">Quote to PO %</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((person) => (
                <tr key={person.name} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{person.name}</td>
                  <td className="text-center py-3 px-2">{person.leadCount}</td>
                  <td className="text-center py-3 px-2">
                    <span className="inline-flex items-center justify-center bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                      {person.conversionRate}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                      {person.quoteToPO}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
