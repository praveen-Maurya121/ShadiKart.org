"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewPresetPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cityType: 'METRO',
    basePrice: '',
    includedServices: JSON.stringify({
      food: '',
      decor: '',
      sound: '',
      barat: '',
      photography: '',
      parlour: '',
    }, null, 2),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const services = JSON.parse(formData.includedServices)

      const res = await fetch(`/api/admin/packages/categories/${params.id}/presets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityType: formData.cityType,
          basePrice: parseFloat(formData.basePrice),
          includedServices: JSON.stringify(services),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to create preset')
        return
      }

      router.push(`/admin/packages/${params.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating preset:', error)
      alert('Failed to create preset. Make sure JSON is valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Preset</h1>
        <p className="text-muted-foreground">Add a new preset for this category</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preset Details</CardTitle>
          <CardDescription>Fill in the details for the new preset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cityType">City Type *</Label>
              <Select
                value={formData.cityType}
                onValueChange={(value) => setFormData({ ...formData, cityType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="METRO">Metro</SelectItem>
                  <SelectItem value="TIER2">Tier 2</SelectItem>
                  <SelectItem value="TIER3">Tier 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="includedServices">Included Services (JSON) *</Label>
              <Textarea
                id="includedServices"
                value={formData.includedServices}
                onChange={(e) => setFormData({ ...formData, includedServices: e.target.value })}
                rows={10}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter JSON object with services like food, decor, sound, etc.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Preset'}
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

