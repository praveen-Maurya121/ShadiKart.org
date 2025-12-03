"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export function BookingPayment({
  bookingId,
  totalPrice,
}: {
  bookingId: string
  totalPrice: number
}) {
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/payment`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        alert("Payment processed successfully!")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="p-4 bg-accent/50 border border-accent rounded-lg">
            <p className="text-sm text-accent-foreground">
              <strong>Note:</strong> This is a demo payment. In production, this will integrate
              with Razorpay/Stripe/UPI gateway.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handlePayment} 
              disabled={processing} 
              className="btn-primary w-[200px]" 
              size="sm"
            >
              {processing ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

