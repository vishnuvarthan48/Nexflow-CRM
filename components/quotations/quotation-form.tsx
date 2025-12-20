"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, useDataStore } from "@/lib/data-store"
import type { Quotation, PriceCategory, QuoteProduct } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus } from "lucide-react"

export function QuotationForm({ quotation }: { quotation?: Quotation }) {
  const router = useRouter()
  const { leads, products, refresh } = useDataStore()

  const [formData, setFormData] = useState({
    customerId: quotation?.customerId || "",
    validUntil: quotation?.validUntil ? quotation.validUntil.toISOString().split("T")[0] : "",
    terms: quotation?.terms || "Payment terms: 50% advance, 50% on delivery. Warranty: 1 year.",
    notes: quotation?.notes || "",
  })

  const [selectedProducts, setSelectedProducts] = useState<QuoteProduct[]>(
    quotation?.products || [
      {
        productId: "",
        productName: "",
        manufacturer: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 18,
        finalPrice: 0,
      },
    ],
  )

  const [priceCategory, setPriceCategory] = useState<PriceCategory>(quotation ? "A" : "A")

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: "",
        productName: "",
        manufacturer: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 18,
        finalPrice: 0,
      },
    ])
  }

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index))
  }

  const updateProduct = (index: number, updates: Partial<QuoteProduct>) => {
    const updated = [...selectedProducts]
    updated[index] = { ...updated[index], ...updates }

    // Recalculate final price
    const product = updated[index]
    const subtotal = product.quantity * product.unitPrice
    const discountAmount = (subtotal * product.discount) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * product.tax) / 100
    updated[index].finalPrice = taxableAmount + taxAmount

    setSelectedProducts(updated)
  }

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    // Get price based on category
    const priceMap: Record<PriceCategory, number> = {
      A: product.priceA,
      B: product.priceB,
      C: product.priceC,
      D: product.priceD,
      E: product.priceE,
    }

    updateProduct(index, {
      productId: product.id,
      productName: product.modelName,
      manufacturer: product.manufacturer,
      unitPrice: priceMap[priceCategory],
    })
  }

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0)
    const totalDiscount = selectedProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice * p.discount) / 100, 0)
    const totalTax = selectedProducts.reduce((sum, p) => {
      const discountedAmount = p.quantity * p.unitPrice * (1 - p.discount / 100)
      return sum + (discountedAmount * p.tax) / 100
    }, 0)
    const total = subtotal - totalDiscount + totalTax

    return { subtotal, totalDiscount, totalTax, total }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const lead = leads.find((l) => l.id === formData.customerId)
    if (!lead) return

    const { subtotal, totalDiscount, totalTax, total } = calculateTotals()

    if (quotation) {
      // Update existing quotation
      dataStore.updateQuotation(quotation.id, {
        ...formData,
        validUntil: new Date(formData.validUntil),
        products: selectedProducts,
        subtotal,
        discount: totalDiscount,
        tax: totalTax,
        totalAmount: total,
      })

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Quotation",
        entityId: quotation.id,
        action: "Updated",
        description: `Quotation ${quotation.quoteNumber} updated`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    } else {
      // Create new quotation
      const quoteNumber = `QT-${new Date().getFullYear()}-${String(quotations.length + 1).padStart(3, "0")}`

      const newQuotation: Quotation = {
        id: `q${Date.now()}`,
        enquiryId: "",
        quoteNumber,
        customerId: formData.customerId,
        customerName: `${lead.customerName} - ${lead.companyName}`,
        products: selectedProducts,
        subtotal,
        discount: totalDiscount,
        tax: totalTax,
        totalAmount: total,
        status: "Draft",
        validUntil: new Date(formData.validUntil),
        terms: formData.terms,
        notes: formData.notes,
        createdBy: "u2",
        createdByName: "Priya Sharma",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.addQuotation(newQuotation)

      dataStore.addActivity({
        id: `a${Date.now()}`,
        entityType: "Quotation",
        entityId: newQuotation.id,
        action: "Created",
        description: `Quotation ${quoteNumber} created for ${lead.customerName}`,
        userId: "u2",
        userName: "Priya Sharma",
        timestamp: new Date(),
      })
    }

    refresh()
    router.push("/dashboard/quotations")
  }

  const { quotations } = useDataStore()
  const { subtotal, totalDiscount, totalTax, total } = calculateTotals()

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        {/* Customer & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Information</CardTitle>
            <CardDescription>Select customer and configure quotation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads
                      .filter((l) => l.status !== "Lost")
                      .map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.customerName} - {lead.companyName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceCategory">Price Category *</Label>
                <Select value={priceCategory} onValueChange={(value: PriceCategory) => setPriceCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Category A</SelectItem>
                    <SelectItem value="B">Category B</SelectItem>
                    <SelectItem value="C">Category C</SelectItem>
                    <SelectItem value="D">Category D</SelectItem>
                    <SelectItem value="E">Category E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  required
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Add products to the quotation</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProducts.map((product, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium">Product {index + 1}</h4>
                  {selectedProducts.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Product *</Label>
                    <Select value={product.productId} onValueChange={(value) => handleProductSelect(index, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.modelName} - {p.manufacturer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, { quantity: Number.parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price (₹) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={product.unitPrice}
                      onChange={(e) => updateProduct(index, { unitPrice: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount (%) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={product.discount}
                      onChange={(e) => updateProduct(index, { discount: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax (%) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={product.tax}
                      onChange={(e) => updateProduct(index, { tax: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Final Price (₹)</Label>
                    <Input type="text" value={`₹${product.finalPrice.toLocaleString()}`} disabled />
                  </div>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span className="font-medium text-destructive">-₹{totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span className="font-medium">₹{totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="terms">Terms *</Label>
              <Textarea
                id="terms"
                required
                rows={4}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">{quotation ? "Update Quotation" : "Create Quotation"}</Button>
        </div>
      </div>
    </form>
  )
}
