// Core data types for the CRM system

export type UserRole =
  | "Sales Manager"
  | "Sales Coordinator"
  | "Sales Executive"
  | "Customer Care Executive" // CCE role
  | "Field Executive" // FE role
  | "Functional Team"
  | "Service Manager"
  | "Service Coordinator"
  | "Service Executive"
  | "Admin"

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Visit Scheduled" | "Converted" | "Lost"

export type LeadType = "Cold" | "Warm" | "Hot" | "Existing Customer"

export type PreferredContactMethod = "Email" | "Phone" | "WhatsApp" | "SMS"

export type VisitStatus = "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled"

export type VisitOutcomeStatus =
  | "Next Visit Scheduled"
  | "Demo Request / Trial Request"
  | "Follow-up"
  | "Request Quotation"
  | "Waiting for PO"
  | "PO Received"
  | "Rescheduled Visit"
  | "Others"
  | "No Current Requirements"

export type EnquiryStatus = "New" | "Quote Sent" | "Under Review" | "Approved" | "Rejected"

export type QuoteStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Sent to Customer"
  | "Accepted"
  | "Declined"

export type DemoStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled"

export type ServiceStatus = "Requested" | "Scheduled" | "In Progress" | "Completed" | "On Hold"

export type PriceCategory = "A" | "B" | "C" | "D" | "E"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  territory?: string
  createdAt: Date
}

export interface Lead {
  id: string // LD-YYYY-XXXX format
  // Mandatory fields
  firstName: string
  lastName: string
  email?: string
  phone?: string
  status: string // Changed to string to support dynamic statuses
  workflowStatusId?: string // Link to WorkflowStatus
  assignedTo?: string
  assignedToName?: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  lastContactedDate?: Date // Added for tracking last contact

  // Highly Recommended
  leadName: string // Full display name
  source: string

  // Important Fields
  companyName: string
  industry?: string
  leadType?: LeadType
  leadScore?: number // 0-100
  preferredContactMethod?: PreferredContactMethod
  nextFollowUpDate?: Date

  // Contact Information
  alternatePhone?: string
  secondaryEmail?: string

  // Company/Address Information
  website?: string
  address?: string
  city?: string
  state?: string
  pincode?: string

  // Additional Information
  annualRevenue?: string
  employeeCount?: string
  notes?: string

  // Lead Introducer/Broker
  introducerName?: string
  introducerCompany?: string
  introducerContact?: string

  // Items/Services interested in
  interestedProducts?: string[] // Array of product IDs or names

  statusHistory?: StatusHistoryEntry[]
}

export interface StatusHistoryEntry {
  id: string
  fromStatus?: string
  toStatus: string
  changedBy: string
  changedByName: string
  timestamp: Date
  notes?: string
  duration?: number // Time spent in previous status (in days)
}

export interface Visit {
  id: string // Format: DDMMYYYY-VISITNUMBER (e.g., 18122024-001)
  leadId?: string
  customerId?: string
  customerName?: string // Added for direct customer reference

  pocName?: string
  pocMobile?: string
  pocEmail?: string

  department?: string

  visitType: "Initial" | "Follow-up" | "Demo" | "Service"
  scheduledDate: Date
  scheduledTime: string
  status: VisitStatus
  assignedTo: string
  assignedToName: string
  purpose: string

  productsToDiscuss?: string[] // Array of product/service IDs or names

  address?: string
  city?: string
  state?: string
  pincode?: string

  notes?: string
  outcome?: string

  outcomeStatus?: VisitOutcomeStatus
  outcomeRemarks?: string

  followUpRequired: boolean
  followUpDate?: Date
  rescheduledDate?: Date // Added to capture when visit is rescheduled
  rescheduledReason?: string // Added to capture the reason for rescheduling
  statusHistory?: StatusHistoryEntry[] // Added for status history tracking
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Product {
  id: string
  modelName: string
  manufacturer: string
  country: string
  category: string
  subCategory: string
  productType: string
  description: string
  standardPriceRange: string
  priceA: number
  priceB: number
  priceC: number
  priceD: number
  priceE: number
  buyBackPrice: number
  imageUrl?: string
}

export interface Enquiry {
  id: string
  leadId: string
  customerId?: string
  visitId?: string
  products: EnquiryProduct[]
  status: EnquiryStatus
  priceCategory: PriceCategory
  totalAmount: number
  notes?: string
  createdBy: string
  createdByName: string
  createdAt: Date
  updatedAt: Date
}

export interface EnquiryProduct {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  finalPrice: number
}

export interface Quotation {
  id: string
  enquiryId: string
  quoteNumber: string
  customerId: string
  customerName: string
  products: QuoteProduct[]
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  status: QuoteStatus
  validUntil: Date
  terms: string
  notes?: string
  createdBy: string
  createdByName: string
  approvedBy?: string
  approvedByName?: string
  approvalDate?: Date
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface QuoteProduct {
  productId: string
  productName: string
  manufacturer: string
  quantity: number
  unitPrice: number
  discount: number
  tax: number
  finalPrice: number
}

export interface Demo {
  id: string
  quotationId: string
  customerId: string
  customerName: string
  products: string[]
  scheduledDate: Date
  scheduledTime: string
  location: string
  status: DemoStatus
  assignedTo: string
  assignedToName: string
  outcome?: string
  feedback?: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceRequest {
  id: string
  ticketNumber: string
  customerId: string
  customerName: string
  productId: string
  productName: string
  issueType: "Installation" | "Repair" | "Maintenance" | "Calibration" | "Training"
  priority: "Low" | "Medium" | "High" | "Urgent"
  description: string
  status: ServiceStatus
  assignedTo: string
  assignedToName: string
  scheduledDate?: Date
  completedDate?: Date
  resolution?: string
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  entityType: "Lead" | "Visit" | "Enquiry" | "Quotation" | "Demo" | "Service"
  entityId: string
  action: string
  description: string
  userId: string
  userName: string
  timestamp: Date
}

export interface Company {
  id: string
  name: string
  parentCompanyId?: string
  industry?: string
  website?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  phone?: string
  email?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ItemService {
  id: string
  name: string
  category: string // e.g., "Product", "Service", "Consumable", "Training"
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowStatus {
  id: string
  name: string
  entityType: "Lead" | "Visit" | "Enquiry" | "Quotation" | "Demo" | "Service"
  color: string
  order: number
  isActive: boolean
  allowedTransitions: string[] // IDs of statuses this can transition to
  automationRules: AutomationRule[]
}

export interface AutomationRule {
  id: string
  name: string
  trigger: "status_change" | "time_based" | "field_update"
  conditions: RuleCondition[]
  actions: RuleAction[]
  isActive: boolean
}

export interface RuleCondition {
  field: string
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty"
  value: any
}

export interface RuleAction {
  type: "assign_to" | "create_task" | "send_notification" | "update_field" | "create_record"
  params: Record<string, any>
}

export interface Task {
  id: string
  title: string
  description: string
  entityType: "Lead" | "Visit" | "Enquiry" | "Quotation" | "Demo" | "Service"
  entityId: string
  assignedTo: string
  assignedToName: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Open" | "In Progress" | "Completed" | "Cancelled"
  dueDate?: Date
  completedDate?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface AssignmentRule {
  id: string
  name: string
  entityType: "Lead" | "Visit"
  method: "round_robin" | "territory" | "source" | "workload" | "manual"
  isActive: boolean
  criteria: AssignmentCriteria[]
  assignToRole: UserRole
  specificUsers?: string[] // If empty, applies to all users with the role
}

export interface AssignmentCriteria {
  field: string
  operator: string
  value: any
}

export interface Tenant {
  id: string
  name: string
  domain: string // subdomain or custom domain
  status: "Active" | "Inactive" | "Suspended"
  plan: "Free" | "Starter" | "Professional" | "Enterprise"
  maxUsers: number
  currentUsers: number

  // Admin contact
  adminName: string
  adminEmail: string
  adminPhone?: string

  // Company information
  companyAddress?: string
  companyCity?: string
  companyState?: string
  companyCountry?: string
  companyPincode?: string

  // Configuration
  features: string[] // Array of enabled feature flags
  customBranding?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }

  // Billing
  billingEmail?: string
  subscriptionStartDate: Date
  subscriptionEndDate?: Date

  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastLoginDate?: Date
  notes?: string
}

export interface TenantUser {
  id: string
  tenantId: string
  email: string
  name: string
  role: UserRole
  status: "Active" | "Invited" | "Inactive"
  invitedAt?: Date
  activatedAt?: Date
  lastLoginAt?: Date
}
