"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDataStore } from "@/lib/data-store"
import { Settings, ArrowRight, Edit, Plus, Zap } from "lucide-react"
import { WorkflowStatusEditor } from "@/components/workflow/workflow-status-editor"
import { AssignmentRuleEditor } from "@/components/workflow/assignment-rule-editor"
import { AutomationRuleEditor } from "@/components/workflow/automation-rule-editor"
import type { WorkflowStatus } from "@/lib/types"

export default function WorkflowConfigPage() {
  const { workflowStatuses, assignmentRules, updateWorkflowStatus, deleteWorkflowStatus } = useDataStore()
  const [mounted, setMounted] = useState(false)
  const [editingStatus, setEditingStatus] = useState<WorkflowStatus | null>(null)
  const [showStatusEditor, setShowStatusEditor] = useState(false)
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [editingAutomationRule, setEditingAutomationRule] = useState<{
    statusId: string
    rule: any | null
  } | null>(null)
  const [showAutomationEditor, setShowAutomationEditor] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const leadStatuses = workflowStatuses.filter((s) => s.entityType === "Lead").sort((a, b) => a.order - b.order)

  const stages = [
    {
      name: "Lead Capture & Qualification",
      statuses: leadStatuses.filter((s) =>
        ["New", "Contacted", "Not Responding", "Call Back Requested", "Qualified"].includes(s.name),
      ),
    },
    {
      name: "Appointment & Visit",
      statuses: leadStatuses.filter((s) => ["Appointment Scheduled", "Visit Completed"].includes(s.name)),
    },
    {
      name: "Demo & Quotation",
      statuses: leadStatuses.filter((s) =>
        ["Demo Request", "Demo Completed", "Quotation Request", "Quotation Sent"].includes(s.name),
      ),
    },
    {
      name: "Negotiation & Closure",
      statuses: leadStatuses.filter((s) =>
        ["Negotiation", "Waiting for PO", "PO Received", "Converted"].includes(s.name),
      ),
    },
    {
      name: "On Hold & Follow-up",
      statuses: leadStatuses.filter((s) => ["On Hold", "Follow-up"].includes(s.name)),
    },
    {
      name: "Lost/Closed",
      statuses: leadStatuses.filter((s) =>
        ["Not Interested", "Lost to Competitor", "Lost - Budget Issue", "Fake Inquiry"].includes(s.name),
      ),
    },
  ]

  const handleEditStatus = (status: WorkflowStatus) => {
    setEditingStatus(status)
    setShowStatusEditor(true)
  }

  const handleAddAutomationRule = (statusId: string) => {
    setEditingAutomationRule({ statusId, rule: null })
    setShowAutomationEditor(true)
  }

  const handleEditAutomationRule = (statusId: string, rule: any) => {
    setEditingAutomationRule({ statusId, rule })
    setShowAutomationEditor(true)
  }

  const handleSaveAutomationRule = (rule: any) => {
    if (!editingAutomationRule) return

    const status = workflowStatuses.find((s) => s.id === editingAutomationRule.statusId)
    if (!status) return

    const updatedRules = editingAutomationRule.rule
      ? status.automationRules.map((r) => (r.id === rule.id ? rule : r))
      : [...status.automationRules, rule]

    updateWorkflowStatus(status.id, {
      ...status,
      automationRules: updatedRules,
    })

    setShowAutomationEditor(false)
    setEditingAutomationRule(null)
  }

  const handleDeleteAutomationRule = (statusId: string, ruleId: string) => {
    const status = workflowStatuses.find((s) => s.id === statusId)
    if (!status) return

    if (!confirm("Are you sure you want to delete this automation rule?")) return

    updateWorkflowStatus(status.id, {
      ...status,
      automationRules: status.automationRules.filter((r) => r.id !== ruleId),
    })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Workflow Configuration</h1>
            <p className="text-muted-foreground">Visualize and manage your complete sales process</p>
          </div>
          <Button onClick={() => setShowRuleEditor(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Assignment Rules
          </Button>
        </div>

        <div className="space-y-8">
          {stages.map((stage) => (
            <Card key={stage.name}>
              <CardHeader>
                <CardTitle className="text-xl">{stage.name}</CardTitle>
                <CardDescription>
                  {stage.statuses.length} status{stage.statuses.length !== 1 ? "es" : ""} in this stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {stage.statuses.map((status) => {
                    const nextStatuses = leadStatuses.filter((s) => status.allowedTransitions.includes(s.id))

                    return (
                      <div
                        key={status.id}
                        className="rounded-lg border bg-card p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: status.color }}
                            />
                            <h3 className="font-semibold">{status.name}</h3>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleEditStatus(status)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Automation Rules */}
                        {status.automationRules.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                              <Zap className="h-3 w-3" />
                              Automation Rules
                            </div>
                            <div className="space-y-1">
                              {status.automationRules.map((rule) => (
                                <div
                                  key={rule.id}
                                  className="flex items-center justify-between rounded bg-muted/50 px-2 py-1"
                                >
                                  <span className="text-xs">{rule.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleEditAutomationRule(status.id, rule)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-7 text-xs bg-transparent"
                              onClick={() => handleAddAutomationRule(status.id)}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Rule
                            </Button>
                          </div>
                        )}

                        {status.automationRules.length === 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => handleAddAutomationRule(status.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Automation
                          </Button>
                        )}

                        {/* Transitions */}
                        {nextStatuses.length > 0 && (
                          <div className="space-y-2 pt-2 border-t">
                            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                              <ArrowRight className="h-3 w-3" />
                              Can move to
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {nextStatuses.map((next) => (
                                <Badge
                                  key={next.id}
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: next.color,
                                    color: next.color,
                                  }}
                                >
                                  {next.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {nextStatuses.length === 0 && (
                          <div className="pt-2 border-t">
                            <Badge variant="secondary" className="text-xs">
                              Final Stage
                            </Badge>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assignment Rules Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assignment Rules</CardTitle>
                <CardDescription>Automatic assignment logic for leads and visits</CardDescription>
              </div>
              <Button onClick={() => setShowRuleEditor(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Manage Rules
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {assignmentRules
                .filter((r) => r.isActive)
                .map((rule) => (
                  <div key={rule.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{rule.name}</span>
                      <Badge variant="outline">{rule.entityType}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Method: <span className="font-medium capitalize">{rule.method.replace("_", " ")}</span>
                      {" → "}
                      <span className="font-medium">{rule.assignToRole}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showStatusEditor && (
        <WorkflowStatusEditor
          status={editingStatus}
          allStatuses={leadStatuses}
          onClose={() => {
            setShowStatusEditor(false)
            setEditingStatus(null)
          }}
        />
      )}

      {showRuleEditor && <AssignmentRuleEditor rule={null} onClose={() => setShowRuleEditor(false)} />}

      {showAutomationEditor && editingAutomationRule && (
        <AutomationRuleEditor
          rule={editingAutomationRule.rule}
          statusId={editingAutomationRule.statusId}
          onSave={handleSaveAutomationRule}
          onClose={() => {
            setShowAutomationEditor(false)
            setEditingAutomationRule(null)
          }}
        />
      )}
    </DashboardShell>
  )
}
