"use client"

import { QuotationForm } from "./quotation-form"
import { useDataStore } from "@/lib/data-store"

export function QuotationFormWrapper({ quotationId }: { quotationId: string }) {
  const { quotations } = useDataStore()
  const quotation = quotations.find((q) => q.id === quotationId)

  if (!quotation) {
    return <div>Quotation not found</div>
  }

  return <QuotationForm quotation={quotation} />
}
