"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEmotionalData } from "@/hooks/use-emotional-data"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"

const gunaDetails = {
  sattva: {
    label: "Sattva",
    description: "Clarity, peace, and harmony are leading the way.",
    color: "text-secondary",
  },
  rajas: {
    label: "Rajas",
    description: "Activity, passion, and momentum are rising right now.",
    color: "text-primary",
  },
  tamas: {
    label: "Tamas",
    description: "Grounded rest and introspection are most present today.",
    color: "text-muted-foreground",
  },
} as const

type GunaKey = keyof typeof gunaDetails

export default function LatestInsightPage() {
  const { latest, isLoading } = useEmotionalData()

  if (isLoading && !latest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
          <div className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
            Gathering your most recent reflection…
          </div>
        </div>
      </div>
    )
  }

  if (!latest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <h1 className="font-serif text-2xl font-semibold">No check-ins yet</h1>
            <p className="text-muted-foreground">
              Complete your first daily emotional check-in to see a personalized summary here.
            </p>
            <Link href="/emotional-mapping">
              <Button>
                Begin a check-in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const dominant: GunaKey = latest.dominantGuna
  const dominantInfo = gunaDetails[dominant]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/insights">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Insights
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold">Latest Reflection</h1>
              <p className="text-muted-foreground">Captured on {new Date(latest.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Today's balance snapshot</CardTitle>
              <CardDescription>{dominantInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {(["sattva", "rajas", "tamas"] as const).map((guna) => (
                  <div key={guna} className="space-y-2 rounded-lg border border-border/60 p-4">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{gunaDetails[guna].label}</span>
                      <Badge variant="secondary">{Math.round(latest[guna])}%</Badge>
                    </div>
                    <Progress value={latest[guna]} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {guna === "sattva"
                        ? "Clarity & ease"
                        : guna === "rajas"
                          ? "Energy & drive"
                          : "Rest & grounding"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-dashed border-border/70 p-4">
                <div className={`text-sm font-semibold ${dominantInfo.color}`}>{dominantInfo.label} dominant</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Balance index at <span className="font-medium">{Math.round(latest.balanceIndex)}</span> with confidence {" "}
                  <span className="font-medium">{Math.round(latest.confidence)}%</span>. Notice how your recent routines affect this
                  balance.
                </p>
              </div>
            </CardContent>
          </Card>

          {latest.recommendedInterventionIds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Suggested practices</CardTitle>
                <CardDescription>Chosen to support your current guna balance</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {latest.recommendedInterventionIds.map((id) => (
                  <div key={id} className="rounded-lg border border-border/60 p-4 text-sm">
                    <div className="font-medium">{id.replace(/-/g, " ")}</div>
                    <p className="mt-1 text-xs text-muted-foreground">Add this to your next break or evening ritual.</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {latest.reflection && (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">Your words</CardTitle>
                <CardDescription>Captured as part of today's check-in</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {latest.reflection}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/interventions" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full">
                Explore interventions
              </Button>
            </Link>
            <Link href="/chat" className="flex-1 sm:flex-none">
              <Button className="w-full">
                Continue with Aaranya
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
