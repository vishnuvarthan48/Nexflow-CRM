"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useDataStore } from "@/lib/data-store"
import type { AssignmentRule } from "@/lib/types"

interface AssignmentRuleEditorProps {
  rule: AssignmentRule | null
  onClose: () => void
}

export function AssignmentRuleEditor({ rule, onClose }: AssignmentRuleEditorProps) {
  const { addAssignmentRule, updateAssignmentRule } = useDataStore()
  const [formData, setFormData] = useState<Partial<AssignmentRule>>({
    name: "",
    entityType: "Lead",
    method: "round_robin",
    isActive: true,
    criteria: [],
    assignToRole: "",
  })

  useEffect(() => {
    if (rule) {
      setFormData(rule)
    }
  }, [rule])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.assignToRole) {
      alert("Please fill in all required fields")
      return
    }

    const ruleData: AssignmentRule = {
      id: rule?.id || `rule-${Date.now()}`,
      name: formData.name,
      entityType: formData.entityType || "Lead",
      method: formData.method || "round_robin",
      isActive: formData.isActive !== false,
      criteria: formData.criteria || [],
      assignToRole: formData.assignToRole,
      specificUsers: formData.specificUsers,
    }

    if (rule) {
      updateAssignmentRule(ruleData)
    } else {
      addAssignmentRule(ruleData)
    }

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Assignment Rule" : "Add New Assignment Rule"}</DialogTitle>
          <DialogDescription>Configure automatic assignment rules for leads and visits</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name *</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Auto-assign New Leads to CCE"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type *</Label>
              <Select
                value={formData.entityType || "Lead"}
                onValueChange={(value: any) => setFormData({ ...formData, entityType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Visit">Visit</SelectItem>
                  <SelectItem value="Enquiry">Enquiry</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Assignment Method *</Label>
              <Select
                value={formData.method || "round_robin"}
                onValueChange={(value: any) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                  <SelectItem value="territory">Territory Based</SelectItem>
                  <SelectItem value="workload">Workload Based</SelectItem>
                  <SelectItem value="specific">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignToRole">Assign to Role *</Label>
            <Select
              value={formData.assignToRole || ""}
              onValueChange={(value) => setFormData({ ...formData, assignToRole: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive !== false}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
            />
            <Label htmlFor="isActive">Active Rule</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{rule ? "Update" : "Create"} Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
