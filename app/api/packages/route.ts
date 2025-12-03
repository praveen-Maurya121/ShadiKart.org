import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const cityType = searchParams.get('cityType')
    const guestCount = searchParams.get('guestCount')
    const budgetMin = searchParams.get('budgetMin')
    const budgetMax = searchParams.get('budgetMax')

    const categories = await prisma.packageCategory.findMany({
      include: {
        presets: {
          where: cityType ? { cityType: cityType as any } : undefined,
        },
      },
      orderBy: { basePriceMetro: 'desc' },
    })

    // Filter by guest count if provided
    let filtered = categories
    if (guestCount) {
      const count = parseInt(guestCount)
      filtered = categories.filter(
        cat => count >= cat.defaultGuestRangeMin && count <= cat.defaultGuestRangeMax
      )
    }

    // Filter by budget if provided
    if (budgetMin || budgetMax) {
      filtered = filtered.filter(cat => {
        const basePrice = cityType === 'METRO' ? cat.basePriceMetro :
                         cityType === 'TIER2' ? cat.basePriceTier2 :
                         cat.basePriceTier3
        
        if (budgetMin && basePrice < parseFloat(budgetMin)) return false
        if (budgetMax && basePrice > parseFloat(budgetMax)) return false
        return true
      })
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

