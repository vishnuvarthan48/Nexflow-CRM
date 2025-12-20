"use client"

import { ServiceRequestForm } from "./service-request-form"
import { useDataStore } from "@/lib/data-store"

export function ServiceRequestFormWrapper({ serviceRequestId }: { serviceRequestId: string }) {
  const { serviceRequests } = useDataStore()
  const serviceRequest = serviceRequests.find((sr) => sr.id === serviceRequestId)

  if (!serviceRequest) {
    return <div>Service request not found</div>
  }

  return <ServiceRequestForm serviceRequest={serviceRequest} />
}
