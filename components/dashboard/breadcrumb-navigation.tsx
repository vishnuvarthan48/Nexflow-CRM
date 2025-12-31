"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  visits: "Visits",
  quotations: "Quotations",
  demos: "Demos",
  service: "Service",
  companies: "Companies",
  "items-services": "Items/Services",
  reports: "Reports",
  tasks: "Tasks",
  workflow: "Workflow",
  new: "New",
  edit: "Edit",
  schedule: "Schedule",
}

export function BreadcrumbNavigation() {
  const pathname = usePathname()

  if (!pathname || pathname === "/dashboard") {
    return null
  }

  const paths = pathname.split("/").filter((path) => path !== "")

  // Build breadcrumb items
  const breadcrumbs = paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/")
    const isLast = index === paths.length - 1

    // Check if path is an ID (numeric or UUID pattern)
    const isId = /^[0-9a-f-]+$/i.test(path) || !isNaN(Number(path))

    // Get display name
    let displayName = pathNameMap[path] || path
    if (isId) {
      displayName = "Details"
    }

    // Capitalize first letter
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

    return {
      href,
      label: displayName,
      isLast,
      isId,
    }
  })

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
