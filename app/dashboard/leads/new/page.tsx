"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LeadForm } from "@/components/leads/lead-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewLeadPage() {
  console.log("[v0] NewLeadPage rendering")

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Lead</h1>
            <p className="text-muted-foreground">Add a new lead to the system</p>
          </div>
        </div>

        <LeadForm />
      </div>
    </DashboardShell>
  )
}
