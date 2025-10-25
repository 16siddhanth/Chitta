import type { ChatInsights, ChatMessage, EmotionalEntry } from "./storage"

export type ModerationResult = {
  severity: "safe" | "sensitive" | "crisis"
  tags: string[]
  matched?: string[]
}

const THEME_MAP: Array<{
  id: string
  label: string
  keywords: string[]
}> = [
  {
    id: "overwhelm",
    label: "Overwhelm & Anxiety",
    keywords: ["stress", "anxious", "overwhelm", "panic", "worried", "burnout", "pressure"],
  },
  {
    id: "fatigue",
    label: "Fatigue & Low Energy",
    keywords: ["tired", "exhausted", "drained", "burnt out", "sleepy", "fatigue"],
  },
  {
    id: "anger",
    label: "Anger & Boundaries",
    keywords: ["angry", "frustrated", "irritated", "resent", "boundary", "rage"],
  },
  {
    id: "grief",
    label: "Sadness & Grief",
    keywords: ["sad", "grief", "loss", "lonely", "depressed", "down"],
  },
  {
    id: "guidance",
    label: "Clarity & Guidance",
    keywords: ["guidance", "help", "direction", "purpose", "decision", "choices"],
  },
  {
    id: "gratitude",
    label: "Calm & Gratitude",
    keywords: ["calm", "peaceful", "grateful", "thankful", "still", "grounded"],
  },
  {
    id: "rest",
    label: "Rest & Recovery",
    keywords: ["sleep", "rest", "recover", "reset", "recharge"],
  },
]

const CRISIS_PATTERNS = [
  "suicide",
  "kill myself",
  "end it all",
  "can't go on",
  "cant go on",
  "hurt myself",
  "harm myself",
  "take my life",
  "i want to die",
  "i want to hurt myself",
  "ending my life",
  "self harm",
  "self-harm",
  "killing myself",
  "i might hurt someone",
  "hurt someone",
]

const SENSITIVE_PATTERNS = [
  "panic attack",
  "panic",
  "trauma",
  "abuse",
  "relapse",
  "addiction",
  "self harm",
  "self-harm",
  "cutting",
  "manic",
  "assault",
]

export const generateChatInsights = (
  messages: ChatMessage[],
  entries: EmotionalEntry[],
): ChatInsights => {
  const userMessages = messages.filter((message) => message.role === "user")

  const themeCounts = new Map<string, { label: string; count: number }>()
  const matchedPhrases = new Map<string, Set<string>>()

  for (const theme of THEME_MAP) {
    themeCounts.set(theme.id, { label: theme.label, count: 0 })
    matchedPhrases.set(theme.id, new Set())
  }

  for (const message of userMessages) {
    const content = message.content.toLowerCase()

    for (const theme of THEME_MAP) {
      for (const keyword of theme.keywords) {
        if (content.includes(keyword)) {
          const entry = themeCounts.get(theme.id)
          if (entry) {
            entry.count += 1
          }
          matchedPhrases.get(theme.id)?.add(keyword)
          break
        }
      }
    }
  }

  const rankedThemes = Array.from(themeCounts.entries())
    .filter(([, value]) => value.count > 0)
    .sort(([, a], [, b]) => b.count - a.count)

  const themes = rankedThemes.slice(0, 4).map(([id, value]) => {
    const phrases = Array.from(matchedPhrases.get(id) ?? [])
    return phrases.length ? `${value.label} (${phrases.join(", ")})` : value.label
  })

  const totalMentions = rankedThemes.reduce((acc, [, value]) => acc + value.count, 0)

  const summary = totalMentions
    ? `Recent conversations touch on ${rankedThemes
        .slice(0, 3)
        .map(([, value]) => value.label)
        .join(", ")}.`
    : "Themes are still emerging; invite the user to share what's most alive for them."

  const highlights = entries.slice(0, 3).map((entry) => {
    const reflection = entry.reflection?.trim()
  const reflectionSnippet = reflection ? ` Reflection: "${reflection.slice(0, 120)}${reflection.length > 120 ? "..." : ""}".` : ""
    return `On ${entry.date}, ${entry.dominantGuna} was dominant with balance ${entry.balanceIndex.toFixed(1)} and confidence ${entry.confidence}.${reflectionSnippet}`
  })

  return {
    summary,
    themes,
    highlights,
    lastUpdated: Date.now(),
  }
}

export const classifyModeration = (text: string): ModerationResult => {
  const lowered = text.toLowerCase()
  const matchedCrisis = CRISIS_PATTERNS.filter((phrase) => lowered.includes(phrase))
  if (matchedCrisis.length > 0) {
    return {
      severity: "crisis",
      tags: ["crisis-support"],
      matched: matchedCrisis,
    }
  }

  const matchedSensitive = SENSITIVE_PATTERNS.filter((phrase) => lowered.includes(phrase))
  if (matchedSensitive.length > 0) {
    return {
      severity: "sensitive",
      tags: ["sensitive-topic"],
      matched: matchedSensitive,
    }
  }

  return {
    severity: "safe",
    tags: [],
  }
}
