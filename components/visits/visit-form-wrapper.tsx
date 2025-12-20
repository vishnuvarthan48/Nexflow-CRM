"use client"

import { VisitForm } from "./visit-form"
import { useDataStore } from "@/lib/data-store"

export function VisitFormWrapper({ visitId }: { visitId: string }) {
  const { visits } = useDataStore()
  const visit = visits.find((v) => v.id === visitId)

  if (!visit) {
    return <div>Visit not found</div>
  }

  return <VisitForm visit={visit} />
}
