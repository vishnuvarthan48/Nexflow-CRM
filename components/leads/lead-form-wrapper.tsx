"use client"

import { LeadForm } from "./lead-form"
import { useDataStore } from "@/lib/data-store"

export function LeadFormWrapper({ leadId }: { leadId: string }) {
  const { leads } = useDataStore()
  const lead = leads.find((l) => l.id === leadId)

  if (!lead) {
    return <div>Lead not found</div>
  }

  return <LeadForm lead={lead} />
}
