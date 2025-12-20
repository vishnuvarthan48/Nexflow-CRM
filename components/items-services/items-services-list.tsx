"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { ItemService } from "@/lib/types"
import { Plus, Edit, Trash2, Search } from "lucide-react"

export function ItemsServicesList() {
  const { itemsServices, refresh } = useDataStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<ItemService | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    isActive: true,
  })

  const filtered = itemsServices.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(itemsServices.map((item) => item.category)))

  const handleOpenDialog = (item?: ItemService) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description || "",
        isActive: item.isActive,
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        category: "",
        description: "",
        isActive: true,
      })
    }
    setShowDialog(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      alert("Please fill in required fields")
      return
    }

    if (editingItem) {
      dataStore.updateItemService(editingItem.id, {
        ...formData,
      })
    } else {
      const newItem: ItemService = {
        id: `is${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      dataStore.addItemService(newItem)
    }

    refresh()
    setShowDialog(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item/service?")) {
      dataStore.deleteItemService(id)
      refresh()
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Items & Services</h1>
            <p className="text-muted-foreground">Manage your items and services catalog</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item/Service
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Items & Services</CardTitle>
            <CardDescription>Browse and manage your items and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items/services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.description || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No items/services found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item/Service" : "Add New Item/Service"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the item/service information" : "Enter the details for the new item/service"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Pulmonology Equipment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Consumable">Consumable</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingItem ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
