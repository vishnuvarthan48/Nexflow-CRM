"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Building2, Pencil, Trash2 } from "lucide-react"
import { useDataStore, dataStore } from "@/lib/data-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Company } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function CompaniesList() {
  const { companies, refresh } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    parentCompanyId: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    notes: "",
  })

  const getParentCompanyName = (parentId?: string) => {
    if (!parentId) return null
    const parent = companies.find((c) => c.id === parentId)
    return parent?.name
  }

  const availableParentCompanies = useMemo(() => {
    return companies.filter((c) => c.id !== editingCompany?.id)
  }, [companies, editingCompany])

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedCompanies = useMemo(() => {
    const parents = filteredCompanies.filter((c) => !c.parentCompanyId)
    const children = filteredCompanies.filter((c) => c.parentCompanyId)

    return parents.map((parent) => ({
      parent,
      children: children.filter((c) => c.parentCompanyId === parent.id),
    }))
  }, [filteredCompanies])

  const orphanCompanies = useMemo(() => {
    return filteredCompanies.filter((c) => c.parentCompanyId && !companies.find((p) => p.id === c.parentCompanyId))
  }, [filteredCompanies, companies])

  const handleOpenDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company)
      setFormData({
        name: company.name,
        parentCompanyId: company.parentCompanyId || "",
        industry: company.industry || "",
        website: company.website || "",
        phone: company.phone || "",
        email: company.email || "",
        city: company.city || "",
        state: company.state || "",
        notes: company.notes || "",
      })
    } else {
      setEditingCompany(null)
      setFormData({
        name: "",
        parentCompanyId: "",
        industry: "",
        website: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        notes: "",
      })
    }
    setShowDialog(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    if (editingCompany) {
      dataStore.updateCompany(editingCompany.id, {
        ...formData,
        parentCompanyId: formData.parentCompanyId || undefined,
      })
    } else {
      const newCompany: Company = {
        id: `c${Date.now()}`,
        ...formData,
        parentCompanyId: formData.parentCompanyId || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      dataStore.addCompany(newCompany)
    }

    setShowDialog(false)
    refresh()
  }

  const handleDelete = () => {
    if (deleteCompany) {
      dataStore.deleteCompany(deleteCompany.id)
      setDeleteCompany(null)
      refresh()
    }
  }

  const renderCompanyCard = (company: Company, isChild = false) => (
    <div
      key={company.id}
      className={`flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 ${
        isChild ? "ml-12 border-l-4 border-l-primary/30" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{company.name}</h3>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {company.industry && <span>{company.industry}</span>}
            {company.city && company.state && (
              <span>
                {company.city}, {company.state}
              </span>
            )}
            {company.parentCompanyId && (
              <span className="text-primary">↳ {getParentCompanyName(company.parentCompanyId)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(company)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setDeleteCompany(company)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="text-muted-foreground">Manage your company master list</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company List</CardTitle>
            <CardDescription>All companies in the system (grouped by parent company)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredCompanies.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Building2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No companies found</p>
                </div>
              ) : (
                <>
                  {groupedCompanies.map(({ parent, children }) => (
                    <div key={parent.id} className="space-y-2">
                      {renderCompanyCard(parent)}
                      {children.map((child) => renderCompanyCard(child, true))}
                    </div>
                  ))}
                  {orphanCompanies.map((company) => renderCompanyCard(company))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
            <DialogDescription>
              {editingCompany ? "Update company information" : "Enter the details of the new company"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentCompanyId">Parent Company (Optional)</Label>
                <select
                  id="parentCompanyId"
                  value={formData.parentCompanyId}
                  onChange={(e) => setFormData({ ...formData, parentCompanyId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">No parent company</option>
                  {availableParentCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Healthcare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 12345 67890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {editingCompany ? "Update" : "Add"} Company
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCompany} onOpenChange={() => setDeleteCompany(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete {deleteCompany?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
