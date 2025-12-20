"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import type { AutomationRule, RuleCondition, RuleAction } from "@/lib/types"

interface AutomationRuleEditorProps {
  rule: AutomationRule | null
  statusId: string
  onSave: (rule: AutomationRule) => void
  onClose: () => void
}

export function AutomationRuleEditor({ rule, statusId, onSave, onClose }: AutomationRuleEditorProps) {
  const [name, setName] = useState(rule?.name || "")
  const [trigger, setTrigger] = useState<"status_change" | "time_based" | "field_update">(
    rule?.trigger || "status_change",
  )
  const [isActive, setIsActive] = useState(rule?.isActive ?? true)
  const [conditions, setConditions] = useState<RuleCondition[]>(rule?.conditions || [])
  const [actions, setActions] = useState<RuleAction[]>(rule?.actions || [])

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        field: "",
        operator: "equals",
        value: "",
      },
    ])
  }

  const updateCondition = (index: number, field: keyof RuleCondition, value: any) => {
    const updated = [...conditions]
    updated[index] = { ...updated[index], [field]: value }
    setConditions(updated)
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const addAction = () => {
    setActions([
      ...actions,
      {
        type: "send_notification",
        params: {},
      },
    ])
  }

  const updateAction = (index: number, field: keyof RuleAction, value: any) => {
    const updated = [...actions]
    updated[index] = { ...updated[index], [field]: value }
    setActions(updated)
  }

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const automationRule: AutomationRule = {
      id: rule?.id || `auto-${Date.now()}`,
      name,
      trigger,
      conditions,
      actions,
      isActive,
    }
    onSave(automationRule)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Automation Rule" : "Add Automation Rule"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Auto-assign to CCE"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger</Label>
              <Select value={trigger} onValueChange={(value: any) => setTrigger(value)}>
                <SelectTrigger id="trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status_change">Status Change</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                  <SelectItem value="field_update">Field Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="active" checked={isActive} onCheckedChange={(checked) => setIsActive(!!checked)} />
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Conditions (optional)</Label>
              <Button type="button" size="sm" variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </Button>
            </div>

            {conditions.map((condition, index) => (
              <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Field</Label>
                    <Input
                      value={condition.field}
                      onChange={(e) => updateCondition(index, "field", e.target.value)}
                      placeholder="e.g., days_since_last_contact"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Operator</Label>
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, "operator", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                        <SelectItem value="is_empty">Is Empty</SelectItem>
                        <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Value</Label>
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(index, "value", e.target.value)}
                      placeholder="Value"
                      className="h-9"
                    />
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCondition(index)} className="mt-6">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Actions</Label>
              <Button type="button" size="sm" variant="outline" onClick={addAction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </Button>
            </div>

            {actions.map((action, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Action {index + 1}</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeAction(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Action Type</Label>
                  <Select value={action.type} onValueChange={(value: any) => updateAction(index, "type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send_notification">Send Notification</SelectItem>
                      <SelectItem value="create_task">Create Task</SelectItem>
                      <SelectItem value="assign_to">Assign To</SelectItem>
                      <SelectItem value="update_field">Update Field</SelectItem>
                      <SelectItem value="send_email">Send Email</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic params based on action type */}
                <ActionParamsEditor
                  actionType={action.type}
                  params={action.params}
                  onChange={(params) => updateAction(index, "params", params)}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || actions.length === 0}>
            Save Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ActionParamsEditor({
  actionType,
  params,
  onChange,
}: {
  actionType: string
  params: Record<string, any>
  onChange: (params: Record<string, any>) => void
}) {
  const updateParam = (key: string, value: any) => {
    onChange({ ...params, [key]: value })
  }

  switch (actionType) {
    case "send_notification":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Message</Label>
          <Input
            value={params.message || ""}
            onChange={(e) => updateParam("message", e.target.value)}
            placeholder="Notification message"
          />
          <Label className="text-xs">Notify Roles (comma separated)</Label>
          <Input
            value={params.notifyRoles?.join(", ") || ""}
            onChange={(e) =>
              updateParam(
                "notifyRoles",
                e.target.value.split(",").map((r) => r.trim()),
              )
            }
            placeholder="Sales Manager, Admin"
          />
        </div>
      )

    case "create_task":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Task Title</Label>
          <Input
            value={params.title || ""}
            onChange={(e) => updateParam("title", e.target.value)}
            placeholder="Task title"
          />
          <Label className="text-xs">Description</Label>
          <Input
            value={params.description || ""}
            onChange={(e) => updateParam("description", e.target.value)}
            placeholder="Task description"
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Assign To Role</Label>
              <Select value={params.assignToRole || ""} onValueChange={(value) => updateParam("assignToRole", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer Care Executive">Customer Care Executive</SelectItem>
                  <SelectItem value="Field Executive">Field Executive</SelectItem>
                  <SelectItem value="Functional Team">Functional Team</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priority</Label>
              <Select value={params.priority || ""} onValueChange={(value) => updateParam("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )

    case "assign_to":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Assign To Role</Label>
          <Select value={params.role || ""} onValueChange={(value) => updateParam("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer Care Executive">Customer Care Executive</SelectItem>
              <SelectItem value="Field Executive">Field Executive</SelectItem>
              <SelectItem value="Functional Team">Functional Team</SelectItem>
              <SelectItem value="Sales Manager">Sales Manager</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Label className="text-xs">Assignment Method</Label>
          <Select value={params.method || ""} onValueChange={(value) => updateParam("method", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="round_robin">Round Robin</SelectItem>
              <SelectItem value="territory">Territory Based</SelectItem>
              <SelectItem value="workload">Workload Based</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case "update_field":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Field Name</Label>
          <Input
            value={params.field || ""}
            onChange={(e) => updateParam("field", e.target.value)}
            placeholder="Field to update"
          />
          <Label className="text-xs">New Value</Label>
          <Input
            value={params.value || ""}
            onChange={(e) => updateParam("value", e.target.value)}
            placeholder="New value"
          />
        </div>
      )

    case "send_email":
      return (
        <div className="space-y-2">
          <Label className="text-xs">To Email</Label>
          <Input
            value={params.to || ""}
            onChange={(e) => updateParam("to", e.target.value)}
            placeholder="recipient@example.com"
          />
          <Label className="text-xs">Subject</Label>
          <Input
            value={params.subject || ""}
            onChange={(e) => updateParam("subject", e.target.value)}
            placeholder="Email subject"
          />
          <Label className="text-xs">Body</Label>
          <Input
            value={params.body || ""}
            onChange={(e) => updateParam("body", e.target.value)}
            placeholder="Email body"
          />
        </div>
      )

    case "webhook":
      return (
        <div className="space-y-2">
          <Label className="text-xs">Webhook URL</Label>
          <Input
            value={params.url || ""}
            onChange={(e) => updateParam("url", e.target.value)}
            placeholder="https://api.example.com/webhook"
          />
          <Label className="text-xs">Method</Label>
          <Select value={params.method || "POST"} onValueChange={(value) => updateParam("method", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    default:
      return null
  }
}
