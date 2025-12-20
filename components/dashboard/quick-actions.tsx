"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, FileText, Wrench } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "New Lead",
      description: "Add a new customer lead",
      icon: Plus,
      href: "/dashboard/leads/new",
      variant: "default" as const,
    },
    {
      title: "Schedule Visit",
      description: "Book a customer visit",
      icon: Calendar,
      href: "/dashboard/visits/schedule", // Updated visit route from /create to /schedule
      variant: "outline" as const,
    },
    {
      title: "Create Quote",
      description: "Generate quotation",
      icon: FileText,
      href: "/dashboard/quotations/new",
      variant: "outline" as const,
    },
    {
      title: "Service Request",
      description: "Log service ticket",
      icon: Wrench,
      href: "/dashboard/service/new",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions for faster workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button variant={action.variant} className="h-auto w-full flex-col items-start gap-2 p-4">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
