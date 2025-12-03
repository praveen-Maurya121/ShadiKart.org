"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Booking = {
  currentStage: string
  status: string
}

export function BookingTimeline({ booking }: { booking: Booking }) {
  const stages = [
    { key: "PLANNING", label: "Planning", description: "Initial planning and customization" },
    { key: "PRE_EVENT", label: "Pre-Event", description: "Final preparations and confirmations" },
    { key: "EVENT_DAY", label: "Event Day", description: "Your special day" },
    { key: "POST_EVENT", label: "Post-Event", description: "Media delivery and feedback" },
  ]

  const currentIndex = stages.findIndex((s) => s.key === booking.currentStage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isUpcoming = index > currentIndex

            return (
              <div key={stage.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p
                    className={`font-semibold ${
                      isCurrent ? "text-primary" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                  {isCurrent && (
                    <p className="text-xs text-primary mt-1">Current Stage</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold text-blue-900 mb-2">Checklist</p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <span>✓</span> Package selected and customized
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Guest list prepared
            </li>
            {booking.status === "CONFIRMED" && (
              <li className="flex items-center gap-2">
                <span>✓</span> Payment confirmed
              </li>
            )}
            {booking.currentStage === "PRE_EVENT" && (
              <>
                <li className="flex items-center gap-2">
                  <span>○</span> Final venue confirmation
                </li>
                <li className="flex items-center gap-2">
                  <span>○</span> Vendor coordination
                </li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

