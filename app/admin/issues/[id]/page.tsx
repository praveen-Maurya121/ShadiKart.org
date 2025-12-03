"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

export default function IssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [issue, setIssue] = useState<any>(null)
  const [zoneManagers, setZoneManagers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    zoneManagerId: '',
  })

  useEffect(() => {
    if (params.id) {
      Promise.all([
        fetch(`/api/admin/issues/${params.id}`).then((res) => res.json()),
        fetch('/api/admin/users?role=ZONE_MANAGER').then((res) => res.json()),
      ]).then(([issueData, managersData]) => {
        if (issueData.error) {
          alert(issueData.error)
          router.push('/admin/issues')
          return
        }
        setIssue(issueData)
        setZoneManagers(managersData)
        setFormData({
          status: issueData.status,
          priority: issueData.priority,
          zoneManagerId: issueData.zoneManagerId || '',
        })
        setLoading(false)
      }).catch(() => {
        alert('Failed to load issue')
        router.push('/admin/issues')
      })
    }
  }, [params.id, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/issues/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formData.status,
          priority: formData.priority,
          zoneManagerId: formData.zoneManagerId || null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to update issue')
        return
      }

      const updated = await res.json()
      setIssue(updated)
      alert('Issue updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Error updating issue:', error)
      alert('Failed to update issue')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!issue) {
    return <div>Issue not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/issues" className="text-primary hover:underline mb-2 block">
          ← Back to Issues
        </Link>
        <h1 className="text-3xl font-bold">Issue Details</h1>
        <p className="text-muted-foreground">Issue ID: {issue.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{issue.title}</CardTitle>
              <CardDescription>
                Created: {formatDate(issue.createdAt)} • Updated: {formatDate(issue.updatedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{issue.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Customer:</span> {issue.booking?.user?.name}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {issue.booking?.city?.name}
                </p>
                <p>
                  <span className="font-semibold">Event Date:</span>{' '}
                  {issue.booking?.eventDate ? formatDate(issue.booking.eventDate) : 'N/A'}
                </p>
                <Link href={`/admin/bookings/${issue.bookingId}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Booking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Assign to Zone Manager</label>
                <Select
                  value={formData.zoneManagerId}
                  onValueChange={(value) => setFormData({ ...formData, zoneManagerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {zoneManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      issue.status === 'OPEN'
                        ? 'bg-red-100 text-red-800'
                        : issue.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-800'
                        : issue.status === 'RESOLVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      issue.priority === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : issue.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {issue.priority}
                  </span>
                </div>
                {issue.assignee && (
                  <div>
                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                    <span className="ml-2 font-semibold">{issue.assignee.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

