"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Calendar, Target, Activity, Info } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { EmotionalTrends } from "@/components/emotional-trends"
import { useEmotionalData } from "@/hooks/use-emotional-data"
import { getInterventionDefinition } from "@/lib/interventions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const gunaLabels: Record<string, string> = {
  sattva: "Sattva",
  rajas: "Rajas",
  tamas: "Tamas",
}

export default function InsightsPage() {
  const { trend, summary, latest, entries, isLoading, sessionSummary, sessions } = useEmotionalData()
  const hasEntries = entries.length > 0
  const hasPractices = sessions.length > 0

  const recommendedDefinitions = (latest?.recommendedInterventionIds ?? [])
    .map((id) => getInterventionDefinition(id))
    .filter((definition): definition is NonNullable<typeof definition> => Boolean(definition))
  const primaryRecommendation = recommendedDefinitions[0]

  const focusRecommendations = useMemo(() => {
    if (!hasEntries) {
      return [
        { title: "Start a streak", description: "Complete your first check-in to build insights." },
        { title: "Lean into routine", description: "Aim for one reflection each day this week." },
      ]
    }

    const recommendations = [] as { title: string; description: string }[]

    if (summary.balanceScore < 45) {
      recommendations.push({
        title: "Restore balance",
        description: "Schedule a grounding practice when energy spikes or drops sharply.",
      })
    } else {
      recommendations.push({
        title: "Maintain harmony",
        description: "Keep celebrating the rituals that help you stay steady.",
      })
    }

    if (latest) {
      const dominantFocus = gunaLabels[latest.dominantGuna]
      recommendations.push({
        title: `${dominantFocus} in focus`,
        description: `Notice how today's experiences influence your ${dominantFocus.toLowerCase()} qualities.`,
      })
    } else {
      recommendations.push({
        title: "Observe your rhythms",
        description: "Watch how clarity, activity, and rest fluctuate over the week.",
      })
    }

    if (sessionSummary.completedThisWeek === 0) {
      recommendations.push({
        title: "Bring in practices",
        description: "Complete a micro-intervention to reinforce the shifts you're tracking.",
      })
    } else {
      const gunaName = sessionSummary.topGuna ? gunaLabels[sessionSummary.topGuna] : "Your practices"
      recommendations.push({
        title: `${gunaName} support`,
        description: "Keep leaning on the practices that are resonating this week.",
      })
    }

    if (primaryRecommendation) {
      recommendations.push({
        title: "Suggested next step",
        description: `Try “${primaryRecommendation.title}” to deepen today's integration.`,
      })
    }

    return recommendations
  }, [
    hasEntries,
    latest,
    summary.balanceScore,
    sessionSummary.completedThisWeek,
    sessionSummary.topGuna,
    primaryRecommendation?.title,
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold">Emotional Insights</h1>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        aria-label="Open the Vedic model reference"
                        asChild
                      >
                        <Link href="/docs/vedic-model" target="_blank" rel="noreferrer" prefetch={false}>
                          <Info className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent align="start">
                      <p className="max-w-[200px] text-xs">
                        View the tri-guna formulas and scripture lookup that inform these insights.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                {hasEntries ? "Your journey of self-awareness" : "Check in daily to unlock personalized insights"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EmotionalTrends data={trend} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-base sm:text-lg flex items-center gap-2">
                    <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                    Check-in Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="mb-1 text-2xl sm:text-3xl font-bold text-primary">
                      {isLoading ? "…" : summary.streak || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {summary.streak === 1 ? "day so far" : "days in a row"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-base sm:text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-secondary" />
                    This Week's Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summary.dominant ? (
                    <div className="space-y-3 text-center">
                      <Badge variant="secondary" className="w-full justify-center py-2">
                        {gunaLabels[summary.dominant]} dominant
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Your reflections lean toward {gunaLabels[summary.dominant].toLowerCase()} qualities right now.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      Complete a few check-ins to uncover your emerging pattern.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {focusRecommendations.map((item) => (
                      <div key={item.title} className="text-sm">
                        <div className="mb-1 font-medium">{item.title}</div>
                        <div className="text-muted-foreground">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-base sm:text-lg flex items-center gap-2">
                    <Activity className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                    Practice Activity
                  </CardTitle>
                  <CardDescription>
                    {sessionSummary.completedThisWeek > 0
                      ? "Logs from the past 7 days"
                      : "Complete a practice to unlock trends"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasPractices ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Completed this week</span>
                        <span className="font-semibold">{sessionSummary.completedThisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Minutes invested</span>
                        <span className="font-semibold">{sessionSummary.totalMinutesThisWeek}</span>
                      </div>
                      {sessionSummary.topGuna && (
                        <div className="flex items-center justify-between">
                          <span>Most supported guna</span>
                          <Badge variant="secondary" className="capitalize">
                            {sessionSummary.topGuna}
                          </Badge>
                        </div>
                      )}
                      {sessionSummary.lastSession && (
                        <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {sessionSummary.lastSession.definition?.title ?? "Recent practice"}
                          </span>
                          <span className="ml-1">
                            {formatDistanceToNow(new Date(sessionSummary.lastSession.completedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Practices will appear here once you complete an intervention.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(["sattva", "rajas", "tamas"] as const).map((guna) => (
              <Card key={guna}>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">{gunaLabels[guna]} Insights</CardTitle>
                  <CardDescription>
                    {guna === "sattva"
                      ? "Clarity & Peace"
                      : guna === "rajas"
                        ? "Activity & Passion"
                        : "Rest & Integration"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Average</span>
                      <span className="font-medium">{summary.averages[guna].toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance score</span>
                      <span className="font-medium">{summary.balanceScore.toFixed(0)}%</span>
                    </div>
                    <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                      {hasEntries
                        ? `Notice how ${gunaLabels[guna].toLowerCase()} shifts in response to your routines.`
                        : "Complete a check-in to unlock guidance here."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
