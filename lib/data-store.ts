"use client"

import { useState, useEffect } from "react"
import type {
  Lead,
  Visit,
  Product,
  Enquiry,
  Quotation,
  Demo,
  ServiceRequest,
  Activity,
  User,
  Company,
  ItemService,
  WorkflowStatus,
  Task,
  AssignmentRule,
} from "./types"
import {
  mockUsers,
  mockLeads,
  mockVisits,
  mockProducts,
  mockEnquiries,
  mockQuotations,
  mockDemos,
  mockServiceRequests,
  mockActivities,
  mockCompanies,
  mockItemsServices,
  defaultLeadStatuses,
  defaultAssignmentRules,
  mockTasks, // Added mockTasks import
} from "./mock-data"

// Simple in-memory data store with localStorage persistence
class DataStore {
  private storageKey = "crm-data-store"

  // Initialize with mock data or load from localStorage
  private getData() {
    if (typeof window === "undefined") return this.getDefaultData()

    const stored = localStorage.getItem(this.storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return this.parseDates(parsed)
    }
    return this.getDefaultData()
  }

  private getDefaultData() {
    return {
      users: mockUsers,
      leads: mockLeads,
      visits: mockVisits,
      products: mockProducts,
      enquiries: mockEnquiries,
      quotations: mockQuotations,
      demos: mockDemos,
      serviceRequests: mockServiceRequests,
      activities: mockActivities,
      companies: mockCompanies,
      itemsServices: mockItemsServices,
      workflowStatuses: defaultLeadStatuses,
      tasks: mockTasks, // Changed from empty array to mockTasks
      assignmentRules: defaultAssignmentRules,
    }
  }

  private parseDates(data: any) {
    // Helper to recursively convert date strings to Date objects
    const parseObj = (obj: any): any => {
      if (obj instanceof Array) {
        return obj.map(parseObj)
      }
      if (obj !== null && typeof obj === "object") {
        const parsed: any = {}
        for (const key in obj) {
          if (typeof obj[key] === "string" && /^\d{4}-\d{2}-\d{2}T/.test(obj[key])) {
            parsed[key] = new Date(obj[key])
          } else {
            parsed[key] = parseObj(obj[key])
          }
        }
        return parsed
      }
      return obj
    }
    return parseObj(data)
  }

  private saveData(data: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    }
  }

  // Getters
  getUsers = () => this.getData().users as User[]
  getLeads = () => this.getData().leads as Lead[]
  getVisits = () => this.getData().visits as Visit[]
  getProducts = () => this.getData().products as Product[]
  getEnquiries = () => this.getData().enquiries as Enquiry[]
  getQuotations = () => this.getData().quotations as Quotation[]
  getDemos = () => this.getData().demos as Demo[]
  getServiceRequests = () => this.getData().serviceRequests as ServiceRequest[]
  getActivities = () => this.getData().activities as Activity[]
  getCompanies = () => this.getData().companies as Company[]
  getItemsServices = () => this.getData().itemsServices as ItemService[]
  getWorkflowStatuses = () => this.getData().workflowStatuses as WorkflowStatus[]
  getTasks = () => this.getData().tasks as Task[]
  getAssignmentRules = () => this.getData().assignmentRules as AssignmentRule[]

  // Add methods
  addLead = (lead: Lead) => {
    const data = this.getData()
    data.leads.push(lead)
    this.saveData(data)
  }

  addVisit = (visit: Visit) => {
    const data = this.getData()
    data.visits.push(visit)
    this.saveData(data)
  }

  addEnquiry = (enquiry: Enquiry) => {
    const data = this.getData()
    data.enquiries.push(enquiry)
    this.saveData(data)
  }

  addQuotation = (quotation: Quotation) => {
    const data = this.getData()
    data.quotations.push(quotation)
    this.saveData(data)
  }

  addDemo = (demo: Demo) => {
    const data = this.getData()
    data.demos.push(demo)
    this.saveData(data)
  }

  addServiceRequest = (serviceRequest: ServiceRequest) => {
    const data = this.getData()
    data.serviceRequests.push(serviceRequest)
    this.saveData(data)
  }

  addActivity = (activity: Activity) => {
    const data = this.getData()
    data.activities.push(activity)
    this.saveData(data)
  }

  addCompany = (company: Company) => {
    const data = this.getData()
    data.companies.push(company)
    this.saveData(data)
  }

  addItemService = (itemService: ItemService) => {
    const data = this.getData()
    data.itemsServices.push(itemService)
    this.saveData(data)
  }

  addTask = (task: Task) => {
    const data = this.getData()
    data.tasks.push(task)
    this.saveData(data)
  }

  addWorkflowStatus = (status: WorkflowStatus) => {
    const data = this.getData()
    data.workflowStatuses.push(status)
    this.saveData(data)
  }

  addAssignmentRule = (rule: AssignmentRule) => {
    const data = this.getData()
    data.assignmentRules.push(rule)
    this.saveData(data)
  }

  // Update methods
  updateLead = (id: string, updates: Partial<Lead>) => {
    const data = this.getData()
    const index = data.leads.findIndex((l: Lead) => l.id === id)
    if (index !== -1) {
      const oldLead = data.leads[index]
      const updatedLead = { ...oldLead, ...updates, updatedAt: new Date() }

      if (updates.status && updates.status !== oldLead.status) {
        const currentUser = data.users[0] // In a real app, get current logged-in user
        const statusHistory = updatedLead.statusHistory || []

        // Calculate duration in days
        const lastEntry = statusHistory[statusHistory.length - 1]
        const duration = lastEntry
          ? Math.floor((Date.now() - lastEntry.timestamp.getTime()) / (1000 * 60 * 60 * 24))
          : undefined

        statusHistory.push({
          id: `sh${Date.now()}`,
          fromStatus: oldLead.status,
          toStatus: updates.status,
          changedBy: currentUser.id,
          changedByName: currentUser.name,
          timestamp: new Date(),
          notes: updates.notes || `Status changed to ${updates.status}`,
          duration,
        })

        updatedLead.statusHistory = statusHistory
      }

      data.leads[index] = updatedLead
      this.saveData(data)
    }
  }

  updateVisit = (id: string, updates: Partial<Visit>) => {
    const data = this.getData()
    const index = data.visits.findIndex((v: Visit) => v.id === id)
    if (index !== -1) {
      const oldVisit = data.visits[index]
      const updatedVisit = { ...oldVisit, ...updates, updatedAt: new Date() }

      if (updates.status && updates.status !== oldVisit.status) {
        const currentUser = data.users[0] // In a real app, get current logged-in user
        const statusHistory = updatedVisit.statusHistory || []

        // Calculate duration in days
        const lastEntry = statusHistory[statusHistory.length - 1]
        const duration = lastEntry
          ? Math.floor((Date.now() - lastEntry.timestamp.getTime()) / (1000 * 60 * 60 * 24))
          : undefined

        statusHistory.push({
          id: `sh${Date.now()}`,
          fromStatus: oldVisit.status,
          toStatus: updates.status,
          changedBy: currentUser.id,
          changedByName: currentUser.name,
          timestamp: new Date(),
          notes: updates.notes || updates.rescheduledReason || `Status changed to ${updates.status}`,
          duration,
        })

        updatedVisit.statusHistory = statusHistory
      }

      data.visits[index] = updatedVisit
      this.saveData(data)
    }
  }

  updateEnquiry = (id: string, updates: Partial<Enquiry>) => {
    const data = this.getData()
    const index = data.enquiries.findIndex((e: Enquiry) => e.id === id)
    if (index !== -1) {
      data.enquiries[index] = { ...data.enquiries[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateQuotation = (id: string, updates: Partial<Quotation>) => {
    const data = this.getData()
    const index = data.quotations.findIndex((q: Quotation) => q.id === id)
    if (index !== -1) {
      data.quotations[index] = { ...data.quotations[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateDemo = (id: string, updates: Partial<Demo>) => {
    const data = this.getData()
    const index = data.demos.findIndex((d: Demo) => d.id === id)
    if (index !== -1) {
      data.demos[index] = { ...data.demos[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateServiceRequest = (id: string, updates: Partial<ServiceRequest>) => {
    const data = this.getData()
    const index = data.serviceRequests.findIndex((s: ServiceRequest) => s.id === id)
    if (index !== -1) {
      data.serviceRequests[index] = { ...data.serviceRequests[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateCompany = (id: string, updates: Partial<Company>) => {
    const data = this.getData()
    const index = data.companies.findIndex((c: Company) => c.id === id)
    if (index !== -1) {
      data.companies[index] = { ...data.companies[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateItemService = (id: string, updates: Partial<ItemService>) => {
    const data = this.getData()
    const index = data.itemsServices.findIndex((is: ItemService) => is.id === id)
    if (index !== -1) {
      data.itemsServices[index] = { ...data.itemsServices[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateTask = (id: string, updates: Partial<Task>) => {
    const data = this.getData()
    const index = data.tasks.findIndex((t: Task) => t.id === id)
    if (index !== -1) {
      data.tasks[index] = { ...data.tasks[index], ...updates, updatedAt: new Date() }
      this.saveData(data)
    }
  }

  updateWorkflowStatus = (id: string, updates: Partial<WorkflowStatus>) => {
    const data = this.getData()
    const index = data.workflowStatuses.findIndex((ws: WorkflowStatus) => ws.id === id)
    if (index !== -1) {
      data.workflowStatuses[index] = { ...data.workflowStatuses[index], ...updates }
      this.saveData(data)
    }
  }

  updateAssignmentRule = (id: string, updates: Partial<AssignmentRule>) => {
    const data = this.getData()
    const index = data.assignmentRules.findIndex((ar: AssignmentRule) => ar.id === id)
    if (index !== -1) {
      data.assignmentRules[index] = { ...data.assignmentRules[index], ...updates }
      this.saveData(data)
    }
  }

  // Delete methods
  deleteLead = (id: string) => {
    const data = this.getData()
    data.leads = data.leads.filter((l: Lead) => l.id !== id)
    this.saveData(data)
  }

  deleteVisit = (id: string) => {
    const data = this.getData()
    data.visits = data.visits.filter((v: Visit) => v.id !== id)
    this.saveData(data)
  }

  deleteCompany = (id: string) => {
    const data = this.getData()
    data.companies = data.companies.filter((c: Company) => c.id !== id)
    this.saveData(data)
  }

  deleteItemService = (id: string) => {
    const data = this.getData()
    data.itemsServices = data.itemsServices.filter((is: ItemService) => is.id !== id)
    this.saveData(data)
  }

  deleteTask = (id: string) => {
    const data = this.getData()
    data.tasks = data.tasks.filter((t: Task) => t.id !== id)
    this.saveData(data)
  }

  generateVisitId = () => {
    const data = this.getData()
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()
    const datePrefix = `${dd}${mm}${yyyy}`

    // Count visits created today
    const todayVisits = data.visits.filter((v: Visit) => v.id.startsWith(datePrefix))
    const visitNumber = String(todayVisits.length + 1).padStart(3, "0")

    return `${datePrefix}-${visitNumber}`
  }

  // Reset to mock data
  reset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey)
    }
  }
}

export const dataStore = new DataStore()

// React hook for easy data access with auto-refresh
export function useDataStore() {
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorage = () => refresh()
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return {
    users: dataStore.getUsers(),
    leads: dataStore.getLeads(),
    visits: dataStore.getVisits(),
    products: dataStore.getProducts(),
    enquiries: dataStore.getEnquiries(),
    quotations: dataStore.getQuotations(),
    demos: dataStore.getDemos(),
    serviceRequests: dataStore.getServiceRequests(),
    activities: dataStore.getActivities(),
    companies: dataStore.getCompanies(),
    itemsServices: dataStore.getItemsServices(),
    workflowStatuses: dataStore.getWorkflowStatuses(),
    tasks: dataStore.getTasks(),
    assignmentRules: dataStore.getAssignmentRules(),
    refresh,
  }
}
