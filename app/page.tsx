"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Flower2,
  Sun,
  Flame,
  Moon,
  Wind,
  Heart,
  Brain,
  Sparkles,
  Droplet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmotionalData } from "@/hooks/use-emotional-data"
import { formatDurationLabel, getInterventionDefinition } from "@/lib/interventions"

type GunaState = {
  sattva: number
  rajas: number
  tamas: number
}

type GunaNode = {
  id: number
  name: string
  icon: LucideIcon
  color: string
  description: string
}

type InterventionSuggestion = {
  slug: string
  icon: LucideIcon
  title: string
  subtitle: string
  duration: string
}

type InterventionPreset = {
  icon: LucideIcon
  title: string
  subtitle: string
  duration?: string
}

const interventionLookup: Record<string, InterventionPreset> = {
  "gratitude-reflection": {
    icon: Heart,
    title: "Gratitude Reflection",
    subtitle: "Note three moments of appreciation",
    duration: "5 min",
  },
  "mindful-awareness": {
    icon: Brain,
    title: "Mindful Awareness",
    subtitle: "Observe sensations with gentle curiosity",
    duration: "4 min",
  },
  "vision-clarity": {
    icon: Sun,
    title: "Vision Clarity",
    subtitle: "Reconnect with your guiding intention",
    duration: "6 min",
  },
  "alternate-nostril": {
    icon: Wind,
    title: "Alternate Nostril Breath",
    subtitle: "Balance energy through focused breath",
    duration: "3 min",
  },
  "calming-breath": {
    icon: Flower2,
    title: "Calming Breath",
    subtitle: "Slow and soften the nervous system",
    duration: "2 min",
  },
  "focus-mantra": {
    icon: Sparkles,
    title: "Focus Mantra",
    subtitle: "Anchor attention with a steady phrase",
    duration: "4 min",
  },
  "energizing-breath": {
    icon: Flame,
    title: "Energizing Breath",
    subtitle: "Invite warmth and uplift",
    duration: "3 min",
  },
  "body-scan-activation": {
    icon: Droplet,
    title: "Body Scan Activation",
    subtitle: "Wake up sleepy energy",
    duration: "6 min",
  },
  "gentle-movement": {
    icon: Moon,
    title: "Gentle Movement",
    subtitle: "Unwind tension with mindful stretches",
    duration: "8 min",
  },
}

const gunaNodes: GunaNode[] = [
  {
    id: 1,
    name: "Sattva",
    icon: Sun,
    color: "from-amber-200 to-amber-100",
    description: "Calm clarity, balance, and empathy",
  },
  {
    id: 2,
    name: "Rajas",
    icon: Flame,
    color: "from-amber-400 to-orange-300",
    description: "Motivation, passion, and purposeful action",
  },
  {
    id: 3,
    name: "Tamas",
    icon: Moon,
    color: "from-orange-600 to-rose-500",
    description: "Rest, reflection, and steady grounding",
  },
]

const suggestedPrompts = [
  "I'm feeling anxious and need to settle",
  "Help me understand my emotions",
  "Suggest a quick reset practice",
  "I need guidance for better rest",
]

const calculateNodePosition = (index: number, total: number, rotationAngle: number) => {
  const angle = ((index / total) * 360 + rotationAngle) % 360
  const radius = 120
  const radian = (angle * Math.PI) / 180
  const x = radius * Math.cos(radian)
  const y = radius * Math.sin(radian)
  const zIndex = Math.round(100 + 50 * Math.cos(radian))
  const opacity = Math.max(0.55, Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2)))

  return { x, y, zIndex, opacity }
}

export default function ChittaHome() {
  const { latest, summary, entries } = useEmotionalData()
  const hasEntries = entries.length > 0
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

  const dominantLabel = summary.dominant
    ? summary.dominant.charAt(0).toUpperCase() + summary.dominant.slice(1)
    : null

  const suggestedInterventions = useMemo<InterventionSuggestion[]>(() => {
    const fallbackInterventionIds = ["gratitude-reflection", "calming-breath", "focus-mantra", "gentle-movement"]
    const recommendationIds = latest?.recommendedInterventionIds && latest.recommendedInterventionIds.length > 0
      ? latest.recommendedInterventionIds
      : fallbackInterventionIds

    const buildSuggestion = (id: string): InterventionSuggestion => {
      const preset = interventionLookup[id]
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

  const [selectedGuna, setSelectedGuna] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.5) % 360)
      }, 50)
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer)
      }
    }
  }, [autoRotate])

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
                <div className="relative flex h-64 sm:h-80 items-center justify-center">
                  <div className="absolute flex h-full w-full items-center justify-center">
                    <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow-xl">
                      <Flower2 className="h-10 w-10" />
                    </div>
                    <div className="absolute h-56 w-56 rounded-full border border-orange-200/40" />
                    {gunaNodes.map((node, index) => {
                      const position = calculateNodePosition(index, gunaNodes.length, rotationAngle)
                      const Icon = node.icon
                      const isSelected = selectedGuna === node.name

                      return (
                        <button
                          key={node.id}
                          type="button"
                          className="absolute transition-all duration-700"
                          style={{
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            zIndex: isSelected ? 200 : position.zIndex,
                            opacity: isSelected ? 1 : position.opacity,
                          }}
                          onClick={() => {
                            const nextSelected = isSelected ? null : node.name
                            setSelectedGuna(nextSelected)
                            setAutoRotate(!nextSelected)
                          }}
                        >
                          <span
                            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${node.color} shadow-lg transition-all duration-300 ${
                              isSelected ? "scale-125 shadow-2xl" : "hover:scale-110"
                            }`}
                          >
                            <Icon className="h-7 w-7 text-white" />
                          </span>
                          <span className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                            <p className={`text-xs font-semibold text-slate-800 transition-all ${isSelected ? "scale-110" : ""}`}>
                              {node.name}
                            </p>
                            {isSelected && (
                              <p className="mt-1 text-xs text-slate-600 animate-fade-in">{node.description}</p>
                            )}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
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
                {suggestedInterventions.map((intervention) => {
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
                <p className="text-sm text-slate-600">
                  {latest
                    ? `Your last check-in on ${new Date(latest.timestamp).toLocaleDateString()} recorded a balance index of ${Math.round(latest.balanceIndex)} with ${Math.round(latest.confidence)}% confidence.`
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
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="border-b border-orange-100/80 bg-gradient-to-r from-white to-amber-50">
                <CardTitle className="flex items-center text-lg text-slate-900">
                  <Brain className="mr-2 h-5 w-5 text-orange-500" />
                  Track Emerging Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 md:grid-cols-2">
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
              </CardContent>
            </Card>

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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
