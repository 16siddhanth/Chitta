"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Calendar, Target } from "lucide-react"
import Link from "next/link"
import { EmotionalTrends } from "@/components/emotional-trends"
import { useEmotionalData } from "@/hooks/use-emotional-data"

const gunaLabels: Record<string, string> = {
  sattva: "Sattva",
  rajas: "Rajas",
  tamas: "Tamas",
}

export default function InsightsPage() {
  const { trend, summary, latest, entries, isLoading } = useEmotionalData()
  const hasEntries = entries.length > 0

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

    return recommendations
  }, [hasEntries, latest, summary.balanceScore])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold">Emotional Insights</h1>
              <p className="text-muted-foreground">
                {hasEntries ? "Your journey of self-awareness" : "Check in daily to unlock personalized insights"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EmotionalTrends data={trend} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Check-in Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="mb-1 text-3xl font-bold text-primary">
                      {isLoading ? "…" : summary.streak || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {summary.streak === 1 ? "day so far" : "days in a row"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
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
