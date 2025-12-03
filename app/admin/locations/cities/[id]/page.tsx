"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function EditCityPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    type: 'METRO',
  })

  useEffect(() => {
    if (params.id) {
      fetch(`/api/admin/locations/cities/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error)
            router.push('/admin/locations')
            return
          }
          setFormData({
            name: data.name,
            state: data.state,
            type: data.type,
          })
          setLoading(false)
        })
        .catch(() => {
          alert('Failed to load city')
          router.push('/admin/locations')
        })
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/locations/cities/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to update city')
        return
      }

      router.push('/admin/locations')
      router.refresh()
    } catch (error) {
      console.error('Error updating city:', error)
      alert('Failed to update city')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this city?')) return

    try {
      const res = await fetch(`/api/admin/locations/cities/${params.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to delete city')
        return
      }

      router.push('/admin/locations')
      router.refresh()
    } catch (error) {
      console.error('Error deleting city:', error)
      alert('Failed to delete city')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit City</h1>
        <p className="text-muted-foreground">Update city details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>City Details</CardTitle>
          <CardDescription>Update the details for this city</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">City Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">City Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
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
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

