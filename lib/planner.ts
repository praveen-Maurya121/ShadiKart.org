import { prisma } from './db'

export type PlannerPreference = "TRADITIONAL" | "TRENDY" | "FUSION" | "MINIMAL"

export interface PlannerInput {
  cityId: string
  cityType: "METRO" | "TIER2" | "TIER3"
  guestCount: number
  budgetMin: number
  budgetMax: number
  eventDate: Date
  preference: PlannerPreference
}

export interface PlannerResult {
  packageCategoryId: string
  packagePresetId: string | null
  estimatedPrice: number
  suggestedAddOnIds: string[]
  summary: string
}

export async function planWedding(input: PlannerInput): Promise<PlannerResult> {
  const { cityType, guestCount, budgetMin, budgetMax, preference } = input

  // Get all package categories
  const categories = await prisma.packageCategory.findMany({
    orderBy: { basePriceMetro: 'desc' },
  })

  // Determine which category fits the budget
  const getBasePrice = (category: typeof categories[0]) => {
    switch (cityType) {
      case 'METRO':
        return category.basePriceMetro
      case 'TIER2':
        return category.basePriceTier2
      case 'TIER3':
        return category.basePriceTier3
    }
  }

  // Find the best matching category based on budget
  let selectedCategory = categories[0]
  for (const category of categories) {
    const basePrice = getBasePrice(category)
    const estimatedPrice = basePrice * (guestCount / category.defaultGuestRangeMin)
    
    if (estimatedPrice >= budgetMin && estimatedPrice <= budgetMax) {
      selectedCategory = category
      break
    }
  }

  // If budget is too high, use the most expensive category
  const maxCategoryPrice = getBasePrice(categories[0]) * (guestCount / categories[0].defaultGuestRangeMin)
  if (budgetMax > maxCategoryPrice) {
    selectedCategory = categories[0]
  }

  // If budget is too low, use the cheapest category
  const minCategoryPrice = getBasePrice(categories[categories.length - 1]) * 
    (guestCount / categories[categories.length - 1].defaultGuestRangeMax)
  if (budgetMin < minCategoryPrice) {
    selectedCategory = categories[categories.length - 1]
  }

  // Get a preset for this category and city type
  const preset = await prisma.packagePreset.findFirst({
    where: {
      packageCategoryId: selectedCategory.id,
      cityType,
    },
  })

  if (!preset) {
    throw new Error(`No preset found for category ${selectedCategory.name} and city type ${cityType}`)
  }

  // Calculate estimated price
  const basePrice = getBasePrice(selectedCategory)
  const guestFactor = Math.max(0.5, Math.min(2.0, guestCount / selectedCategory.defaultGuestRangeMin))
  
  // Get guest factor multiplier from config if available
  const guestFactorConfig = await prisma.plannerConfig.findUnique({
    where: { key: 'guest_factor_multiplier' },
  })
  const guestFactorMultiplier = guestFactorConfig 
    ? parseFloat(guestFactorConfig.value) || 1.0 
    : 1.0
  
  const styleMultiplier = await getStyleMultiplier(preference)
  const estimatedPrice = basePrice * guestFactor * guestFactorMultiplier * styleMultiplier

  // Get suggested add-ons based on preference and category
  const allAddOns = await prisma.addOn.findMany({
    where: { isActive: true },
  })

  const suggestedAddOns = selectAddOns(allAddOns, preference, selectedCategory.name)

  // Generate summary text
  const summaryText = generateSummary(selectedCategory, preset, estimatedPrice, guestCount, preference)

  return {
    packageCategoryId: selectedCategory.id,
    packagePresetId: preset.id,
    estimatedPrice: Math.round(estimatedPrice),
    suggestedAddOnIds: suggestedAddOns.map(ao => ao.id),
    summary: summaryText,
  }
}

async function getStyleMultiplier(preference: PlannerPreference): Promise<number> {
  // Try to get from config, fallback to defaults
  const configKey = `style_multiplier_${preference.toLowerCase()}`
  const config = await prisma.plannerConfig.findUnique({
    where: { key: configKey },
  })

  if (config) {
    const value = parseFloat(config.value)
    if (!isNaN(value)) return value
  }

  // Default multipliers
  switch (preference) {
    case 'TRENDY':
      return 1.15
    case 'FUSION':
      return 1.1
    case 'MINIMAL':
      return 0.95
    case 'TRADITIONAL':
    default:
      return 1.0
  }
}

function selectAddOns(
  addOns: Array<{ id: string; name: string; description: string | null; priceType: string }>,
  preference: PlannerPreference,
  categoryName: string
) {
  // Simple logic: select 2-4 add-ons based on preference
  const filtered = addOns.filter(ao => {
    const nameLower = ao.name.toLowerCase()
    if (preference === 'TRENDY' && (nameLower.includes('drone') || nameLower.includes('live'))) {
      return true
    }
    if (preference === 'TRADITIONAL' && (nameLower.includes('band') || nameLower.includes('baja') || nameLower.includes('fireworks'))) {
      return true
    }
    if (preference === 'FUSION' && (nameLower.includes('catering') || nameLower.includes('extra'))) {
      return true
    }
    return false
  })

  // If not enough filtered, add some random ones
  if (filtered.length < 2) {
    const remaining = addOns.filter(ao => !filtered.includes(ao))
    filtered.push(...remaining.slice(0, 4 - filtered.length))
  }

  return filtered.slice(0, 4)
}

function generateSummary(
  category: { name: string },
  preset: { includedServices: Record<string, any> },
  price: number,
  guests: number,
  preference: string
): string {
  const services = preset.includedServices as Record<string, string>
  return `Based on your ${preference.toLowerCase()} preferences and ${guests} guests, we recommend the ${category.name} package. This includes ${services.food || 'premium catering'}, ${services.decor || 'elegant decor'}, and ${services.photography || 'professional photography'}. Estimated cost: ₹${Math.round(price).toLocaleString('en-IN')}.`
}

