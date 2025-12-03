"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function EditPackageCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [category, setCategory] = useState<any>(null)
  const [presets, setPresets] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePriceMetro: '',
    basePriceTier2: '',
    basePriceTier3: '',
    defaultGuestRangeMin: '',
    defaultGuestRangeMax: '',
  })

  useEffect(() => {
    if (params.id) {
      Promise.all([
        fetch(`/api/admin/packages/categories/${params.id}`).then((res) => res.json()),
        fetch(`/api/admin/packages/categories/${params.id}/presets`).then((res) => res.json()),
      ]).then(([catData, presetsData]) => {
        if (catData.error) {
          alert(catData.error)
          router.push('/admin/packages')
          return
        }
        setCategory(catData)
        setPresets(presetsData)
        setFormData({
          name: catData.name,
          description: catData.description || '',
          basePriceMetro: catData.basePriceMetro.toString(),
          basePriceTier2: catData.basePriceTier2.toString(),
          basePriceTier3: catData.basePriceTier3.toString(),
          defaultGuestRangeMin: catData.defaultGuestRangeMin.toString(),
          defaultGuestRangeMax: catData.defaultGuestRangeMax.toString(),
        })
        setLoading(false)
      }).catch(() => {
        alert('Failed to load package category')
        router.push('/admin/packages')
      })
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/packages/categories/${params.id}`, {
        method: 'PUT',
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
        alert(error.error || 'Failed to update package category')
        return
      }

      router.push('/admin/packages')
      router.refresh()
    } catch (error) {
      console.error('Error updating package category:', error)
      alert('Failed to update package category')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Package Category</h1>
        <p className="text-muted-foreground">Update category details and manage presets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Update the details for this package category</CardDescription>
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Presets ({presets.length})</CardTitle>
              <CardDescription>Manage presets for this category</CardDescription>
            </div>
            <Link href={`/admin/packages/${params.id}/presets/new`}>
              <Button>Add Preset</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {presets.length === 0 ? (
            <p className="text-muted-foreground">No presets found.</p>
          ) : (
            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{preset.cityType}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(preset.basePrice)}
                    </p>
                  </div>
                  <Link href={`/admin/packages/presets/${preset.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

