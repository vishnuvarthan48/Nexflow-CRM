"use client"

import { DemoForm } from "./demo-form"
import { useDataStore } from "@/lib/data-store"

export function DemoFormWrapper({ demoId }: { demoId: string }) {
  const { demos } = useDataStore()
  const demo = demos.find((d) => d.id === demoId)

  if (!demo) {
    return <div>Demo not found</div>
  }

  return <DemoForm demo={demo} />
}
