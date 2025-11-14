"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat-interface"
import { useEmotionalData } from "@/hooks/use-emotional-data"
import type { ChatContext } from "@/lib/chat-context"

const SUGGESTED_PROMPTS = [
  "I'm feeling anxious and need to settle",
  "Help me understand my emotions",
  "Suggest a quick reset practice",
  "I need guidance for better rest",
]

const INITIAL_MESSAGE =
  "Hello, I'm Aaranya—your mindful companion. Share what's on your mind and I'll offer gentle guidance inspired by the balance of the three gunas."

export default function ChatPage() {
  const { latest, summary, entries } = useEmotionalData()

  const chatContext = useMemo<ChatContext | undefined>(() => {
    if (!latest && entries.length === 0) {
      return undefined
    }

    const context: ChatContext = {}

    if (latest) {
      context.latestEntry = {
        date: latest.date,
        dominantGuna: latest.dominantGuna,
        balanceIndex: latest.balanceIndex,
        confidence: latest.confidence,
        reflection: latest.reflection,
        recommendedInterventions: latest.recommendedInterventionIds,
        metrics: latest.metrics,
      }
      context.recommendedInterventions = latest.recommendedInterventionIds
    }

    if (entries.length > 0) {
      context.emotionalSummary = {
        streak: summary.streak,
        dominant: summary.dominant,
        balanceScore: summary.balanceScore,
        averages: summary.averages,
      }

      context.recentEntries = entries.slice(0, 5).map((entry) => ({
        date: entry.date,
        dominantGuna: entry.dominantGuna,
        balanceIndex: entry.balanceIndex,
        reflection: entry.reflection,
      }))

      const reflections = entries
        .map((entry) => entry.reflection?.trim())
        .filter((text): text is string => Boolean(text && text.length > 0))
        .slice(0, 3)

      if (reflections.length > 0) {
        context.recentReflections = reflections
      }
    }

    return context
  }, [entries, latest, summary])

  return (
    <div className="vedic-aurora min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="relative z-10 container mx-auto px-4 py-4 sm:py-10 max-w-4xl space-y-4 sm:space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl tracking-tight">Aaranya</h1>
            <p className="text-sm text-muted-foreground">Your Compassionate AI Companion</p>
          </div>
        </div>

        <div className="fade-in-up">
          <ChatInterface initialMessage={INITIAL_MESSAGE} context={chatContext} suggestedPrompts={SUGGESTED_PROMPTS} />
        </div>

        <p className="text-xs text-muted-foreground text-center px-4">
          Aaranya offers reflective guidance grounded in Vedic-inspired wellbeing. For urgent mental health support, please
          reach out to a licensed professional.
        </p>
      </div>
    </div>
  )
}
