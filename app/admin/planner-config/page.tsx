"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminPlannerConfigPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [configs, setConfigs] = useState<Record<string, string>>({})

  // Default configs to show
  const defaultConfigs = [
    { key: 'styleMultipliers', label: 'Style Multipliers (JSON)', default: '{"Traditional": 1.0, "Trendy": 1.15, "Fusion": 1.1, "Minimal": 0.95}' },
    { key: 'guestFactorConfig', label: 'Guest Factor Config (JSON)', default: '{"min": 0.8, "max": 1.2}' },
    { key: 'categoryThresholds', label: 'Category Thresholds (JSON)', default: '[]' },
  ]

  useEffect(() => {
    fetch('/api/admin/planner-config')
      .then((res) => res.json())
      .then((data) => {
        const configMap: Record<string, string> = {}
        data.forEach((c: any) => {
          configMap[c.key] = c.value
        })
        setConfigs(configMap)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleSave = async (key: string, value: string) => {
    setSaving(key)
    try {
      const res = await fetch(`/api/admin/planner-config/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to save configuration')
        return
      }

      const updated = await res.json()
      setConfigs((prev) => ({ ...prev, [key]: updated.value }))
      alert('Configuration saved successfully')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Planner Configuration</h1>
        <p className="text-muted-foreground">
          Configure multipliers and factors for the AI planner
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {defaultConfigs.map((config) => (
              <div key={config.key} className="space-y-2">
                <Label htmlFor={config.key}>{config.label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={config.key}
                    type="text"
                    value={configs[config.key] || config.default}
                    onChange={(e) => setConfigs({ ...configs, [config.key]: e.target.value })}
                    placeholder={config.default}
                    className="font-mono"
                  />
                  <Button
                    onClick={() => handleSave(config.key, configs[config.key] || config.default)}
                    disabled={saving === config.key}
                  >
                    {saving === config.key ? 'Saving...' : 'Save'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Default: {config.default}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

