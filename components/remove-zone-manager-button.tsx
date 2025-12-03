"use client"

import { Button } from '@/components/ui/button'

export function RemoveZoneManagerButton({ profileId }: { profileId: string }) {
  const handleRemove = async () => {
    if (!confirm('Remove this zone manager from their zone?')) return

    try {
      const res = await fetch(`/api/admin/locations/zone-managers/${profileId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to remove zone manager')
      }
    } catch (error) {
      console.error('Error removing zone manager:', error)
      alert('Failed to remove zone manager')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleRemove}>
      Remove
    </Button>
  )
}

