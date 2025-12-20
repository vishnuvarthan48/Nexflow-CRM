"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { VisitFormSimple } from "@/components/visits/visit-form-simple"

export default function ScheduleVisitPage() {
  console.log("[v0] ScheduleVisitPage - PAGE IS LOADING SUCCESSFULLY")

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 bg-green-500 text-white px-6 py-4 rounded-lg">
        <p className="font-bold text-xl">✓ VISIT SCHEDULING PAGE LOADED</p>
        <p className="text-sm">You are on the correct page: /dashboard/visits/schedule</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/visits">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Visits
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Schedule New Visit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <VisitFormSimple />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
