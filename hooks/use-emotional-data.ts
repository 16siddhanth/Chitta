"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { EmotionalEntry, InterventionSession } from "@/lib/storage"
import { getUserData } from "@/lib/storage"
import { computeTrend, summariseEntries, type SummaryMetrics, type TrendPoint } from "@/lib/emotional-model"
import { analyseInterventionSessions, type InterventionAnalytics } from "@/lib/interventions"

interface EmotionalDataState {
  entries: EmotionalEntry[]
  trend: TrendPoint[]
  summary: SummaryMetrics
  latest?: EmotionalEntry
  sessions: InterventionSession[]
  sessionSummary: InterventionAnalytics
  isLoading: boolean
  refresh: () => Promise<void>
}

export function useEmotionalData(): EmotionalDataState {
  const [entries, setEntries] = useState<EmotionalEntry[]>([])
  const [sessions, setSessions] = useState<InterventionSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await getUserData()
      setEntries(() => [...data.emotionalEntries].sort((a, b) => b.timestamp - a.timestamp))
      setSessions(() => [...data.interventionSessions].sort((a, b) => b.completedAt - a.completedAt))
    } catch (error) {
      console.error("Failed to load emotional entries", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      setIsLoading(true)
      await load()
    }

    if (mounted) {
      void run()
    }

    return () => {
      mounted = false
    }
  }, [load])

  const trend = useMemo(() => computeTrend(entries), [entries])
  const summary = useMemo(() => summariseEntries(entries), [entries])
  const latest = useMemo(() => entries.at(0), [entries])
  const sessionSummary = useMemo(() => analyseInterventionSessions(sessions), [sessions])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await load()
  }, [load])

  return { entries, trend, summary, latest, sessions, sessionSummary, isLoading, refresh }
}
