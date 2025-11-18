"use client"

import { Brain } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { SummaryMetrics } from "@/lib/emotional-model"
import type { EmotionalEntry } from "@/lib/storage"

interface PatternInsightsProps {
  summary: SummaryMetrics
  latest?: EmotionalEntry
  hasEntries: boolean
  isLoading?: boolean
}

export function PatternInsightsCard({ summary, latest, hasEntries, isLoading }: PatternInsightsProps) {
  const dominantLabel = summary.dominant ? summary.dominant.charAt(0).toUpperCase() + summary.dominant.slice(1) : null

  return (
    <Card className="bg-white/80 backdrop-blur-md shadow-lg">
      <CardHeader className="border-b border-orange-100/80 bg-gradient-to-r from-white to-amber-50">
        <CardTitle className="flex items-center text-lg text-slate-900">
          <Brain className="mr-2 h-5 w-5 text-orange-500" />
          Track Emerging Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-6 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={`pattern-skeleton-${index}`} className="rounded-xl border border-orange-100 bg-white/70 p-4">
              <Skeleton className="h-3 w-28 bg-orange-100/80" />
              <Skeleton className="mt-3 h-16 w-full bg-orange-100/50" />
            </div>
          ))
        ) : (
          <>
            <div className="rounded-xl border border-orange-100 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-500">Focus Insight</p>
              <p className="mt-2 text-sm text-slate-700">
                {hasEntries && dominantLabel
                  ? `Your recent reflections lean toward ${dominantLabel}. Keep supporting this energy with the practices that feel nourishing.`
                  : "Complete a few check-ins to reveal where your energy is trending."}
              </p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-500">Rest Insight</p>
              <p className="mt-2 text-sm text-slate-700">
                {hasEntries && latest
                  ? `Balance index sits at ${Math.round(latest.balanceIndex)}%. Schedule one gentle reset ritual today to keep momentum.`
                  : "Micro-pauses and evening journaling keep your inner climate steady."}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
