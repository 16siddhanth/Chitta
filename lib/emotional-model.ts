import type { EmotionalEntry, WearableSnapshot } from "./storage"

export type RawCheckIn = {
  clarity: number
  peace: number
  energy: number
  restlessness: number
  activity: number
  inertia: number
  reflection: string
  dateISO?: string
}

export type EmotionalSnapshot = {
  sattva: number
  rajas: number
  tamas: number
  balanceIndex: number
  dominantGuna: EmotionalEntry["dominantGuna"]
  confidence: number
  recommendedInterventionIds: string[]
}

export type WearableInputs = {
  hrv?: number
  sleepQuality?: number
  activityLoad?: number
  breathRate?: number
  readinessScore?: number
  lastSync?: number
}

export interface CalculatedEntry {
  entry: EmotionalEntry
  raw: RawCheckIn
}

const NORMALIZATION_FLOOR = 5
const CONFIDENCE_BASE = 0.5

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max)

const smoothAverage = (values: number[], weights: number[]) => {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = values.reduce((acc, value, index) => acc + value * weights[index], 0)
  return weightedSum / totalWeight
}

const normalizeTrio = (sattva: number, rajas: number, tamas: number) => {
  const adjusted = [sattva, rajas, tamas].map((value) => Math.max(value, NORMALIZATION_FLOOR))
  const total = adjusted.reduce((acc, value) => acc + value, 0)
  return adjusted.map((value) => (value / total) * 100) as [number, number, number]
}

const interventionCatalog: Record<string, { guna: EmotionalEntry["dominantGuna"]; focus: "calm" | "energize" | "uplift" | "integrate" }> = {
  "gratitude-reflection": { guna: "sattva", focus: "integrate" },
  "mindful-awareness": { guna: "sattva", focus: "calm" },
  "vision-clarity": { guna: "sattva", focus: "integrate" },
  "alternate-nostril": { guna: "rajas", focus: "calm" },
  "calming-breath": { guna: "rajas", focus: "calm" },
  "focus-mantra": { guna: "rajas", focus: "integrate" },
  "energizing-breath": { guna: "tamas", focus: "energize" },
  "body-scan-activation": { guna: "tamas", focus: "uplift" },
  "gentle-movement": { guna: "tamas", focus: "energize" },
}

const recommendInterventions = (dominant: EmotionalEntry["dominantGuna"], balanceIndex: number) => {
  const focus: Record<typeof dominant, "calm" | "energize" | "uplift" | "integrate"> = {
    sattva: balanceIndex >= 45 ? "integrate" : "calm",
    rajas: balanceIndex < 35 ? "calm" : "integrate",
    tamas: balanceIndex < 35 ? "energize" : "uplift",
  }

  const desiredFocus = focus[dominant]
  const matching = Object.entries(interventionCatalog)
    .filter(([, value]) => value.guna === dominant || value.focus === desiredFocus)
    .map(([key]) => key)

  return matching.slice(0, 3)
}

const computeConfidence = (snapshot: RawCheckIn, wearable?: WearableInputs) => {
  const spread = Math.max(snapshot.clarity, snapshot.peace, 100 - snapshot.restlessness) - Math.min(snapshot.inertia, 100 - snapshot.energy)
  const normalizedSpread = clamp(spread / 100, 0, 1)
  const wearableBonus = wearable?.hrv || wearable?.sleepQuality || wearable?.readinessScore ? 0.15 : 0
  return clamp((CONFIDENCE_BASE + normalizedSpread * 0.4 + wearableBonus) * 100, 40, 95)
}

export const calculateEmotionalSnapshot = (raw: RawCheckIn, wearable?: WearableInputs): EmotionalSnapshot => {
  const clarityBlend = smoothAverage([raw.clarity, 100 - raw.inertia, 100 - raw.restlessness], [0.45, 0.3, 0.25])
  const peaceBlend = smoothAverage([raw.peace, 100 - raw.restlessness, 100 - raw.activity], [0.5, 0.3, 0.2])
  const sattvaRaw = smoothAverage([clarityBlend, peaceBlend], [0.6, 0.4])

  const rajasActivation = smoothAverage([raw.energy, raw.activity, raw.restlessness], [0.45, 0.35, 0.2])
  const rajasCounterbalance = smoothAverage([100 - raw.peace, 100 - raw.clarity], [0.6, 0.4])
  const rajasRaw = (rajasActivation + rajasCounterbalance) / 2

  const tamasWeight = smoothAverage([raw.inertia, 100 - raw.energy, 100 - raw.clarity], [0.5, 0.3, 0.2])

  const [sattva, rajas, tamas] = normalizeTrio(sattvaRaw, rajasRaw, tamasWeight)

  const dominant = ((): EmotionalEntry["dominantGuna"] => {
    if (sattva >= rajas && sattva >= tamas) return "sattva"
    if (rajas >= sattva && rajas >= tamas) return "rajas"
    return "tamas"
  })()

  const balanceIndex = clamp(100 - Math.abs(sattva - rajas) - Math.abs(sattva - tamas) / 2, 0, 100)

  const confidence = computeConfidence(raw, wearable)
  const recommendedInterventionIds = recommendInterventions(dominant, balanceIndex)

  return {
    sattva: Number(sattva.toFixed(2)),
    rajas: Number(rajas.toFixed(2)),
    tamas: Number(tamas.toFixed(2)),
    balanceIndex: Number(balanceIndex.toFixed(2)),
    dominantGuna: dominant,
    confidence,
    recommendedInterventionIds,
  }
}

export const buildEmotionalPayload = (
  raw: RawCheckIn,
  wearable?: WearableInputs,
): Omit<EmotionalEntry, "id" | "timestamp"> => {
  const snapshot = calculateEmotionalSnapshot(raw, wearable)
  const now = new Date()
  const entry = {
    date: raw.dateISO ?? now.toISOString().split("T")[0],
    sattva: snapshot.sattva,
    rajas: snapshot.rajas,
    tamas: snapshot.tamas,
    balanceIndex: snapshot.balanceIndex,
    confidence: snapshot.confidence,
    reflection: raw.reflection,
    dominantGuna: snapshot.dominantGuna,
    recommendedInterventionIds: snapshot.recommendedInterventionIds,
    metrics: {
      clarity: raw.clarity,
      peace: raw.peace,
      energy: raw.energy,
      restlessness: raw.restlessness,
      activity: raw.activity,
      inertia: raw.inertia,
    },
    wearable: wearable ? { ...wearable, lastSync: wearable?.lastSync ?? now.getTime() } : undefined,
  }

  return entry
}

export type TrendPoint = {
  date: string
  sattva: number
  rajas: number
  tamas: number
}

const byDate = (entries: EmotionalEntry[]) =>
  [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

export const computeTrend = (entries: EmotionalEntry[], days = 7): TrendPoint[] => {
  const sorted = byDate(entries)
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return sorted
    .filter((entry) => new Date(entry.date).getTime() >= cutoff)
    .map((entry) => ({ date: entry.date, sattva: entry.sattva, rajas: entry.rajas, tamas: entry.tamas }))
}

export const computeDominantPattern = (entries: EmotionalEntry[]) => {
  if (!entries.length) {
    return {
      dominant: null as EmotionalEntry["dominantGuna"] | null,
      streak: 0,
      averages: { sattva: 0, rajas: 0, tamas: 0 },
    }
  }

  const totals = entries.reduce(
    (acc, entry) => {
      acc.sattva += entry.sattva
      acc.rajas += entry.rajas
      acc.tamas += entry.tamas
      return acc
    },
    { sattva: 0, rajas: 0, tamas: 0 },
  )

  const averages = {
    sattva: Number((totals.sattva / entries.length).toFixed(2)),
    rajas: Number((totals.rajas / entries.length).toFixed(2)),
    tamas: Number((totals.tamas / entries.length).toFixed(2)),
  }

  const dominant = ((): EmotionalEntry["dominantGuna"] => {
    if (averages.sattva >= averages.rajas && averages.sattva >= averages.tamas) return "sattva"
    if (averages.rajas >= averages.sattva && averages.rajas >= averages.tamas) return "rajas"
    return "tamas"
  })()

  let streak = 0
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp)
  for (const entry of sorted) {
    if (entry.dominantGuna === dominant) {
      streak += 1
    } else {
      break
    }
  }

  return { dominant, streak, averages }
}

export type SummaryMetrics = {
  streak: number
  dominant: EmotionalEntry["dominantGuna"] | null
  averages: { sattva: number; rajas: number; tamas: number }
  balanceScore: number
}

export const summariseEntries = (entries: EmotionalEntry[]): SummaryMetrics => {
  const { streak, dominant, averages } = computeDominantPattern(entries)
  const balanceScore = entries.length
    ? Number((entries.reduce((acc, entry) => acc + entry.balanceIndex, 0) / entries.length).toFixed(2))
    : 0

  return { streak, dominant, averages, balanceScore }
}

export const createEntryFromCheckIn = (
  raw: RawCheckIn,
  wearable?: WearableInputs,
): { payload: Omit<EmotionalEntry, "id" | "timestamp">; snapshot: EmotionalSnapshot } => {
  const snapshot = calculateEmotionalSnapshot(raw, wearable)
  const payload = buildEmotionalPayload(raw, wearable)
  return { payload, snapshot }
}
