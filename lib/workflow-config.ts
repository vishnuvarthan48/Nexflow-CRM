import type { WorkflowStatus, AssignmentRule, RuleAction } from "./types"

// Default workflow statuses for each entity type
export const defaultLeadStatuses: WorkflowStatus[] = [
  {
    id: "lead-new",
    name: "New",
    entityType: "Lead",
    color: "#3b82f6",
    order: 1,
    isActive: true,
    allowedTransitions: ["lead-contacted", "lead-not-interested"],
    automationRules: [
      {
        id: "auto-assign-cce",
        name: "Auto-assign to CCE",
        trigger: "status_change",
        conditions: [],
        actions: [
          {
            type: "assign_to",
            params: { role: "Customer Care Executive", method: "round_robin" },
          },
          {
            type: "create_task",
            params: {
              title: "Contact New Lead",
              description: "Make initial contact with the lead",
              priority: "High",
            },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-contacted",
    name: "Contacted",
    entityType: "Lead",
    color: "#8b5cf6",
    order: 2,
    isActive: true,
    allowedTransitions: ["lead-qualified", "lead-not-responding", "lead-callback", "lead-not-interested"],
    automationRules: [],
  },
  {
    id: "lead-not-responding",
    name: "Not Responding",
    entityType: "Lead",
    color: "#f59e0b",
    order: 3,
    isActive: true,
    allowedTransitions: ["lead-contacted", "lead-callback", "lead-not-interested"],
    automationRules: [
      {
        id: "reminder-follow-up",
        name: "Follow-up Reminder",
        trigger: "time_based",
        conditions: [{ field: "days_since_last_contact", operator: "greater_than", value: 2 }],
        actions: [
          {
            type: "send_notification",
            params: { message: "Follow-up required for non-responding lead" },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-callback",
    name: "Call Back Requested",
    entityType: "Lead",
    color: "#ec4899",
    order: 4,
    isActive: true,
    allowedTransitions: ["lead-contacted", "lead-qualified"],
    automationRules: [],
  },
  {
    id: "lead-qualified",
    name: "Qualified",
    entityType: "Lead",
    color: "#10b981",
    order: 5,
    isActive: true,
    allowedTransitions: ["lead-appointment-scheduled", "lead-not-interested"],
    automationRules: [],
  },
  {
    id: "lead-appointment-scheduled",
    name: "Appointment Scheduled",
    entityType: "Lead",
    color: "#06b6d4",
    order: 6,
    isActive: true,
    allowedTransitions: ["lead-visit-completed", "lead-qualified"],
    automationRules: [
      {
        id: "assign-field-executive",
        name: "Assign to Field Executive",
        trigger: "status_change",
        conditions: [],
        actions: [
          {
            type: "create_task",
            params: {
              title: "Conduct Field Visit",
              assignToRole: "Field Executive",
              priority: "High",
            },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-visit-completed",
    name: "Visit Completed",
    entityType: "Lead",
    color: "#8b5cf6",
    order: 7,
    isActive: true,
    allowedTransitions: ["lead-demo-request", "lead-quotation-request", "lead-follow-up", "lead-not-interested"],
    automationRules: [],
  },
  {
    id: "lead-demo-request",
    name: "Demo Request",
    entityType: "Lead",
    color: "#f59e0b",
    order: 8,
    isActive: true,
    allowedTransitions: ["lead-demo-completed", "lead-quotation-request"],
    automationRules: [
      {
        id: "assign-functional-team",
        name: "Assign to Functional Team",
        trigger: "status_change",
        conditions: [],
        actions: [
          {
            type: "create_task",
            params: {
              title: "Prepare Demo",
              assignToRole: "Functional Team",
              priority: "High",
            },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-demo-completed",
    name: "Demo Completed",
    entityType: "Lead",
    color: "#8b5cf6",
    order: 9,
    isActive: true,
    allowedTransitions: ["lead-quotation-request", "lead-follow-up", "lead-not-interested"],
    automationRules: [
      {
        id: "demo-follow-up",
        name: "Demo Follow-up Reminder",
        trigger: "time_based",
        conditions: [{ field: "days_since_demo", operator: "greater_than", value: 2 }],
        actions: [
          {
            type: "send_notification",
            params: { message: "Follow-up required after demo" },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-quotation-request",
    name: "Quotation Request",
    entityType: "Lead",
    color: "#f59e0b",
    order: 10,
    isActive: true,
    allowedTransitions: ["lead-quotation-sent"],
    automationRules: [
      {
        id: "create-quotation",
        name: "Create Quotation",
        trigger: "status_change",
        conditions: [],
        actions: [
          {
            type: "create_task",
            params: {
              title: "Prepare Quotation",
              assignToRole: "Functional Team",
              priority: "High",
            },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-quotation-sent",
    name: "Quotation Sent",
    entityType: "Lead",
    color: "#06b6d4",
    order: 11,
    isActive: true,
    allowedTransitions: ["lead-waiting-po", "lead-negotiation", "lead-not-interested"],
    automationRules: [
      {
        id: "quotation-follow-up",
        name: "Quotation Follow-up",
        trigger: "time_based",
        conditions: [{ field: "days_since_quote", operator: "greater_than", value: 2 }],
        actions: [
          {
            type: "send_notification",
            params: {
              message: "Follow-up required after quotation sent",
              notifyRoles: ["Sales Manager", "Admin"],
            },
          },
          {
            type: "create_task",
            params: {
              title: "Create Work Order",
              assignToRole: "Admin",
              priority: "Urgent",
            },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-negotiation",
    name: "Negotiation",
    entityType: "Lead",
    color: "#f59e0b",
    order: 12,
    isActive: true,
    allowedTransitions: ["lead-quotation-sent", "lead-waiting-po", "lead-not-interested"],
    automationRules: [],
  },
  {
    id: "lead-waiting-po",
    name: "Waiting for PO",
    entityType: "Lead",
    color: "#8b5cf6",
    order: 13,
    isActive: true,
    allowedTransitions: ["lead-po-received", "lead-on-hold", "lead-not-interested"],
    automationRules: [],
  },
  {
    id: "lead-po-received",
    name: "PO Received",
    entityType: "Lead",
    color: "#10b981",
    order: 14,
    isActive: true,
    allowedTransitions: ["lead-converted"],
    automationRules: [
      {
        id: "po-received-actions",
        name: "PO Received Actions",
        trigger: "status_change",
        conditions: [],
        actions: [
          {
            type: "send_notification",
            params: {
              message: "PO received - Notify accounts & operations",
              notifyRoles: ["Sales Manager", "Admin"],
            },
          },
          {
            type: "create_task",
            params: {
              title: "Create Work Order",
              assignToRole: "Admin",
              priority: "Urgent",
            },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-converted",
    name: "Converted",
    entityType: "Lead",
    color: "#22c55e",
    order: 15,
    isActive: true,
    allowedTransitions: [],
    automationRules: [],
  },
  {
    id: "lead-on-hold",
    name: "On Hold",
    entityType: "Lead",
    color: "#6b7280",
    order: 16,
    isActive: true,
    allowedTransitions: ["lead-qualified", "lead-follow-up", "lead-not-interested"],
    automationRules: [],
  },
  {
    id: "lead-follow-up",
    name: "Follow-up",
    entityType: "Lead",
    color: "#f59e0b",
    order: 17,
    isActive: true,
    allowedTransitions: ["lead-qualified", "lead-appointment-scheduled", "lead-not-interested"],
    automationRules: [
      {
        id: "follow-up-reminder",
        name: "Follow-up Reminder",
        trigger: "time_based",
        conditions: [{ field: "days_since_last_activity", operator: "greater_than", value: 7 }],
        actions: [
          {
            type: "send_notification",
            params: { message: "Follow-up required - No activity for 7 days" },
          },
        ],
        isActive: true,
      },
    ],
  },
  {
    id: "lead-not-interested",
    name: "Not Interested",
    entityType: "Lead",
    color: "#ef4444",
    order: 18,
    isActive: true,
    allowedTransitions: [],
    automationRules: [],
  },
  {
    id: "lead-lost-competitor",
    name: "Lost to Competitor",
    entityType: "Lead",
    color: "#ef4444",
    order: 19,
    isActive: true,
    allowedTransitions: [],
    automationRules: [],
  },
  {
    id: "lead-lost-budget",
    name: "Lost - Budget Issue",
    entityType: "Lead",
    color: "#ef4444",
    order: 20,
    isActive: true,
    allowedTransitions: [],
    automationRules: [],
  },
  {
    id: "lead-lost-fake",
    name: "Fake Inquiry",
    entityType: "Lead",
    color: "#ef4444",
    order: 21,
    isActive: true,
    allowedTransitions: [],
    automationRules: [],
  },
]

// Default assignment rules
export const defaultAssignmentRules: AssignmentRule[] = [
  {
    id: "assign-cce-round-robin",
    name: "Auto-assign New Leads to CCE (Round Robin)",
    entityType: "Lead",
    method: "round_robin",
    isActive: true,
    criteria: [{ field: "status", operator: "equals", value: "New" }],
    assignToRole: "Customer Care Executive",
  },
  {
    id: "assign-fe-territory",
    name: "Assign Visits to FE by Territory",
    entityType: "Visit",
    method: "territory",
    isActive: true,
    criteria: [],
    assignToRole: "Field Executive",
  },
]

// Helper functions for workflow management
export function getWorkflowStatusById(id: string, statuses: WorkflowStatus[]): WorkflowStatus | undefined {
  return statuses.find((s) => s.id === id)
}

export function getAvailableTransitions(currentStatusId: string, statuses: WorkflowStatus[]): WorkflowStatus[] {
  const currentStatus = getWorkflowStatusById(currentStatusId, statuses)
  if (!currentStatus) return []

  return statuses.filter((s) => currentStatus.allowedTransitions.includes(s.id))
}

export function canTransitionTo(fromStatusId: string, toStatusId: string, statuses: WorkflowStatus[]): boolean {
  const currentStatus = getWorkflowStatusById(fromStatusId, statuses)
  if (!currentStatus) return false

  return currentStatus.allowedTransitions.includes(toStatusId)
}

export function executeAutomationRules(
  status: WorkflowStatus,
  entity: any,
  trigger: "status_change" | "time_based" | "field_update",
): RuleAction[] {
  const applicableRules = status.automationRules.filter((rule) => rule.isActive && rule.trigger === trigger)

  const actionsToExecute: RuleAction[] = []

  for (const rule of applicableRules) {
    // Check if all conditions are met
    const allConditionsMet = rule.conditions.every((condition) => {
      const fieldValue = entity[condition.field]
      switch (condition.operator) {
        case "equals":
          return fieldValue === condition.value
        case "not_equals":
          return fieldValue !== condition.value
        case "contains":
          return String(fieldValue).includes(String(condition.value))
        case "greater_than":
          return Number(fieldValue) > Number(condition.value)
        case "less_than":
          return Number(fieldValue) < Number(condition.value)
        case "is_empty":
          return !fieldValue || fieldValue === ""
        case "is_not_empty":
          return fieldValue && fieldValue !== ""
        default:
          return false
      }
    })

    if (allConditionsMet) {
      actionsToExecute.push(...rule.actions)
    }
  }

  return actionsToExecute
}
