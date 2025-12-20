"use client"

import { useParams } from "next/navigation"
import { VisitDetailSimple } from "@/components/visits/visit-detail-simple"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VisitDetailPage() {
  const params = useParams()
  const visitId = params.id as string

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/visits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Visit Details</h1>
      </div>

      <VisitDetailSimple visitId={visitId} />
    </div>
  )
}
