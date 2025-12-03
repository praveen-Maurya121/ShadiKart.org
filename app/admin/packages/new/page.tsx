"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewPackageCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePriceMetro: '',
    basePriceTier2: '',
    basePriceTier3: '',
    defaultGuestRangeMin: '',
    defaultGuestRangeMax: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/packages/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePriceMetro: parseFloat(formData.basePriceMetro),
          basePriceTier2: parseFloat(formData.basePriceTier2),
          basePriceTier3: parseFloat(formData.basePriceTier3),
          defaultGuestRangeMin: parseInt(formData.defaultGuestRangeMin),
          defaultGuestRangeMax: parseInt(formData.defaultGuestRangeMax),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to create package category')
        return
      }

      router.push('/admin/packages')
      router.refresh()
    } catch (error) {
      console.error('Error creating package category:', error)
      alert('Failed to create package category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Package Category</h1>
        <p className="text-muted-foreground">Add a new package category</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Fill in the details for the new package category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePriceMetro">Base Price (Metro) *</Label>
                <Input
                  id="basePriceMetro"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basePriceMetro}
                  onChange={(e) => setFormData({ ...formData, basePriceMetro: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePriceTier2">Base Price (Tier 2) *</Label>
                <Input
                  id="basePriceTier2"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basePriceTier2}
                  onChange={(e) => setFormData({ ...formData, basePriceTier2: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePriceTier3">Base Price (Tier 3) *</Label>
                <Input
                  id="basePriceTier3"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basePriceTier3}
                  onChange={(e) => setFormData({ ...formData, basePriceTier3: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultGuestRangeMin">Min Guests *</Label>
                <Input
                  id="defaultGuestRangeMin"
                  type="number"
                  min="1"
                  value={formData.defaultGuestRangeMin}
                  onChange={(e) => setFormData({ ...formData, defaultGuestRangeMin: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultGuestRangeMax">Max Guests *</Label>
                <Input
                  id="defaultGuestRangeMax"
                  type="number"
                  min="1"
                  value={formData.defaultGuestRangeMax}
                  onChange={(e) => setFormData({ ...formData, defaultGuestRangeMax: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

