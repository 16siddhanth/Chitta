"use client"

import { useMemo } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Flower2, Heart, Sparkles, Droplet } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEmotionalData } from "@/hooks/use-emotional-data"
import { GunaOrbit } from "@/components/guna-orbit"
import { PatternInsightsCard } from "@/components/pattern-insights"
import {
  formatDurationLabel,
  getInterventionDefinition,
  INTERVENTION_PRESETS,
} from "@/lib/interventions"

type GunaState = {
  sattva: number
  rajas: number
  tamas: number
}

type InterventionSuggestion = {
  slug: string
  icon: LucideIcon
  title: string
  subtitle: string
  duration: string
}

const suggestedPrompts = [
  "I'm feeling anxious and need to settle",
  "Help me understand my emotions",
  "Suggest a quick reset practice",
  "I need guidance for better rest",
]

export default function ChittaHome() {
  const { latest, summary, entries, isLoading } = useEmotionalData()
  const hasEntries = entries.length > 0
  const isHydrating = isLoading && !hasEntries
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [],
  )
  const lastCheckInLabel = useMemo(() => (latest ? dateFormatter.format(new Date(latest.timestamp)) : null), [latest, dateFormatter])
  const gunaState = useMemo<GunaState>(() => {
    if (!latest) {
      return { sattva: 36, rajas: 32, tamas: 32 }
    }
    return {
      sattva: Math.round(latest.sattva),
      rajas: Math.round(latest.rajas),
      tamas: Math.round(latest.tamas),
    }
  }, [latest])

  const suggestedInterventions = useMemo<InterventionSuggestion[]>(() => {
    const fallbackInterventionIds = ["gratitude-reflection", "calming-breath", "focus-mantra", "gentle-movement"]
    const recommendationIds = latest?.recommendedInterventionIds && latest.recommendedInterventionIds.length > 0
      ? latest.recommendedInterventionIds
      : fallbackInterventionIds

    const buildSuggestion = (id: string): InterventionSuggestion => {
      const preset = INTERVENTION_PRESETS[id]
      const definition = getInterventionDefinition(id)
      const durationLabel = definition ? formatDurationLabel(definition.totalDuration) : preset?.duration ?? "5 min"

      if (preset) {
        return {
          slug: id,
          icon: preset.icon,
          title: preset.title,
          subtitle: preset.subtitle,
          duration: durationLabel,
        }
      }

      const title = id
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")

      return {
        slug: id,
        icon: Sparkles,
        title,
        subtitle: "A personalized ritual tuned to your check-in",
        duration: durationLabel,
      }
    }

    return recommendationIds.map(buildSuggestion)
  }, [latest])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-100 text-slate-900">
      <header className="border-b border-orange-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200/60 shadow-inner">
                <Flower2 className="h-7 w-7 text-orange-600" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Chitta</p>
                <h1 className="font-serif text-3xl font-bold text-slate-900">Mindful Wellbeing Studio</h1>
                <p className="text-sm text-slate-600">Blending Vedic wisdom with modern care</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/privacy">
                <Button variant="ghost" className="text-slate-700 hover:bg-orange-100">
                  Privacy
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="border-orange-200 text-slate-700 hover:bg-orange-100">
                  Settings
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:from-orange-600 hover:to-amber-600">
                  <Sparkles className="mr-2 h-4 w-4" /> Meet Aaranya
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 max-w-3xl">
            <h2 className="animate-fade-in font-serif text-4xl font-semibold text-slate-900">
              Cultivate balance, clarity, and compassion within minutes each day.
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Track your emotional patterns, receive tailored micro-interventions, and connect with a gentle AI guide
              who understands the rhythm of your inner world.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(300px,360px)_1fr]">
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="border-b border-orange-100/80 bg-gradient-to-r from-white to-amber-50">
                <CardTitle className="flex items-center text-base sm:text-lg text-slate-900">
                  <Droplet className="mr-2 h-4 sm:h-5 w-4 sm:w-5 text-orange-500" />
                  Tri-Guna Balance
                </CardTitle>
              </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {isHydrating ? (
                    <div className="space-y-6">
                      <Skeleton className="h-64 sm:h-80 w-full rounded-[32px] bg-orange-100/70" />
                      <div className="space-y-4">
                        {Object.keys(gunaState).map((key) => (
                          <div key={`guna-skeleton-${key}`} className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-orange-100/60" />
                            <Skeleton className="h-2 w-full rounded-full bg-orange-100/80" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <GunaOrbit />
                      <div className="mt-6 space-y-4">
                        {Object.entries(gunaState).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-medium capitalize text-slate-700">
                              <span>{key}</span>
                              <span>{Math.round(value)}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-orange-100">
                              <div
                                className={`h-full bg-gradient-to-r ${
                                  key === "sattva"
                                    ? "from-amber-200 to-amber-300"
                                    : key === "rajas"
                                      ? "from-orange-400 to-orange-500"
                                      : "from-rose-500 to-rose-600"
                                } transition-all duration-500`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 via-white to-amber-100/40 backdrop-blur-md shadow-lg">
              <CardContent className="flex flex-col gap-3 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Guided Practices</p>
                <h3 className="font-serif text-2xl text-slate-900">Deepen your reset ritual</h3>
                <p className="text-sm text-slate-600">
                  Visit the interventions studio to choose breathwork, gratitude, and movement sessions tailored to your guna balance.
                </p>
                <Link href="/interventions">
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:from-orange-600 hover:to-amber-600">
                    Open Interventions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="border-b border-orange-100/80 bg-gradient-to-r from-white to-amber-50">
                <CardTitle className="flex items-center text-lg text-slate-900">
                  <Heart className="mr-2 h-5 w-5 text-orange-500" />
                  Micro-Interventions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {isHydrating
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton
                        key={`intervention-skeleton-${index}`}
                        className="h-14 w-full rounded-xl border border-orange-100 bg-orange-50/70"
                      />
                    ))
                  : suggestedInterventions.map((intervention) => {
                      const Icon = intervention.icon
                      return (
                        <Link key={intervention.slug} href={`/interventions/${intervention.slug}`}>
                          <Button
                            variant="outline"
                            className="flex w-full items-center justify-start gap-3 rounded-xl border-orange-200/70 bg-white/60 p-4 text-left text-slate-800 shadow-sm transition-all hover:translate-y-[-2px] hover:border-orange-300 hover:bg-orange-50"
                          >
                            <Icon className="h-5 w-5 text-orange-500" />
                            <span className="flex-1">
                              <span className="block text-sm font-semibold">{intervention.title}</span>
                              <span className="block text-xs text-slate-600">{intervention.subtitle}</span>
                            </span>
                            <Badge variant="secondary" className="whitespace-nowrap bg-orange-100 text-orange-700">
                              {intervention.duration}
                            </Badge>
                          </Button>
                        </Link>
                      )
                    })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="border-b border-orange-100/80 bg-gradient-to-r from-white to-amber-50">
                <CardTitle className="flex items-center text-lg text-slate-900">
                  <Sparkles className="mr-2 h-5 w-5 text-orange-500" />
                  Daily Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {isHydrating ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full bg-orange-50" />
                    <div className="flex flex-wrap gap-3">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <Skeleton key={`action-skeleton-${index}`} className="h-10 w-32 bg-orange-100" />
                      ))}
                    </div>
                    <Skeleton className="h-20 w-full bg-orange-50" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-600">
                      {lastCheckInLabel && latest
                        ? `Your last check-in on ${lastCheckInLabel} recorded a balance index of ${Math.round(latest.balanceIndex)} with ${Math.round(latest.confidence)}% confidence.`
                        : "Begin with a mindful check-in. Noticing your energetic balance each day builds emotional fluency and reveals where gentle support is needed."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/emotional-mapping">
                        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:from-orange-600 hover:to-amber-600">
                          Quick Check-in
                        </Button>
                      </Link>
                      <Link href="/insights">
                        <Button variant="outline" className="border-orange-200 text-slate-700 hover:bg-orange-100">
                          View Insights
                        </Button>
                      </Link>
                    </div>
                    <div className="rounded-xl border border-dashed border-orange-200/80 bg-orange-50/40 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-orange-700">Tip</p>
                      <p>
                        Record one grounded insight after every practice. Over time, your journal becomes a map of what
                        restores balance fastest.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <PatternInsightsCard summary={summary} latest={latest} hasEntries={hasEntries} isLoading={isHydrating} />

            {/* Removed local chat dialog - redirects to /chat */}
            <Card className="bg-gradient-to-br from-orange-500/10 via-white to-amber-200/30 backdrop-blur-md shadow-lg">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-orange-500">AI Companion</p>
                <h3 className="font-serif text-2xl text-slate-900">Need a listening ear?</h3>
                <p className="text-sm text-slate-600">
                  Aaranya listens, reflects, and offers practical micro-practices based on your current guna balance.
                </p>
                <Link href="/chat">
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:from-orange-600 hover:to-amber-600">
                    Start a Conversation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-orange-200/60 bg-white/70">
        <div className="container mx-auto px-4 py-6 text-sm text-slate-600">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>Your reflections stay private on this device.</p>
            <p>Crafted with respect for timeless wellbeing traditions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
