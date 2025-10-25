export type ChatContext = {
  latestEntry?: {
    date: string
    dominantGuna: string
    balanceIndex: number
    confidence: number
    reflection?: string
    recommendedInterventions?: string[]
    metrics?: {
      clarity?: number
      peace?: number
      energy?: number
      restlessness?: number
      activity?: number
      inertia?: number
    }
  }
  emotionalSummary?: {
    streak: number
    dominant: string | null
    balanceScore: number
    averages: {
      sattva: number
      rajas: number
      tamas: number
    }
  }
  recentEntries?: Array<{
    date: string
    dominantGuna: string
    balanceIndex: number
    reflection?: string
  }>
  recentReflections?: string[]
  recommendedInterventions?: string[]
  chatInsights?: {
    summary?: string
    themes?: string[]
    highlights?: string[]
    lastUpdated?: number
  }
  consentGranted?: boolean
  moderationTags?: string[]
}
