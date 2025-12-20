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
import { Checkbox } from "@/components/ui/checkbox"
import { useDataStore } from "@/lib/data-store"
import type { WorkflowStatus } from "@/lib/types"

interface WorkflowStatusEditorProps {
  status: WorkflowStatus | null
  allStatuses: WorkflowStatus[]
  onClose: () => void
}

export function WorkflowStatusEditor({ status, allStatuses, onClose }: WorkflowStatusEditorProps) {
  const { addWorkflowStatus, updateWorkflowStatus } = useDataStore()
  const [formData, setFormData] = useState<Partial<WorkflowStatus>>({
    name: "",
    entityType: "Lead",
    color: "#3b82f6",
    order: allStatuses.length + 1,
    isActive: true,
    allowedTransitions: [],
    automationRules: [],
  })

  useEffect(() => {
    if (status) {
      setFormData(status)
    }
  }, [status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.color) {
      alert("Please fill in all required fields")
      return
    }

    const statusData: WorkflowStatus = {
      id: status?.id || `lead-${formData.name?.toLowerCase().replace(/\s+/g, "-")}`,
      name: formData.name,
      entityType: formData.entityType || "Lead",
      color: formData.color,
      order: formData.order || allStatuses.length + 1,
      isActive: formData.isActive !== false,
      allowedTransitions: formData.allowedTransitions || [],
      automationRules: formData.automationRules || [],
    }

    if (status) {
      updateWorkflowStatus(statusData)
    } else {
      addWorkflowStatus(statusData)
    }

    onClose()
  }

  const toggleTransition = (targetId: string) => {
    const currentTransitions = formData.allowedTransitions || []
    if (currentTransitions.includes(targetId)) {
      setFormData({
        ...formData,
        allowedTransitions: currentTransitions.filter((id) => id !== targetId),
      })
    } else {
      setFormData({
        ...formData,
        allowedTransitions: [...currentTransitions, targetId],
      })
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{status ? "Edit Status" : "Add New Status"}</DialogTitle>
          <DialogDescription>Configure workflow status properties and allowed transitions</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Status Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Qualified"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color || "#3b82f6"}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20"
                  required
                />
                <Input
                  value={formData.color || "#3b82f6"}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="isActive"
                checked={formData.isActive !== false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive">Active Status</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allowed Transitions</Label>
            <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
              {allStatuses
                .filter((s) => s.id !== status?.id)
                .map((s) => (
                  <div key={s.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`transition-${s.id}`}
                      checked={formData.allowedTransitions?.includes(s.id)}
                      onCheckedChange={() => toggleTransition(s.id)}
                    />
                    <Label htmlFor={`transition-${s.id}`} className="flex items-center gap-2 cursor-pointer">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{status ? "Update" : "Create"} Status</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
