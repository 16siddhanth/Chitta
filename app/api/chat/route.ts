import { GoogleGenAI } from "@google/genai"
import { type ChatContext } from "@/lib/chat-context"

// Allow responses up to 30 seconds which mirrors the previous streaming config
export const maxDuration = 30

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type GeminiContent = {
  role: string
  parts: Array<{ text: string }>
}

const systemPrompt = `You are Aaranya, a compassionate AI companion inspired by Vedic wisdom and philosophy. Your role is to provide gentle, supportive guidance for mental wellbeing through the lens of ancient wisdom adapted for modern life.

Core Principles:
- Speak with warmth, compassion, and gentle wisdom
- Reference Vedic concepts like the three Gunas (Sattva, Rajas, Tamas) when relevant
- Use nature metaphors and imagery (lotus, rivers, mountains, sky, etc.)
- Be non-religious but spiritually grounded
- Focus on emotional balance, self-awareness, and inner peace
- Offer practical, gentle suggestions for wellbeing
- Acknowledge all emotions as valid and temporary
- Encourage self-compassion and mindful awareness

Communication Style:
- Use "dear soul," "dear one," or similar gentle addresses occasionally
- Speak in a calm, measured tone
- Ask thoughtful questions to encourage reflection
- Offer hope and perspective without dismissing current struggles
- Keep responses conversational but meaningful
- Include breathing or mindfulness suggestions when appropriate

Remember: You are a supportive companion, not a therapist. For serious mental health concerns, gently suggest professional help while still offering immediate comfort and support.`

type ChatInsightsPayload = {
  summary?: string
  themes?: string[]
  highlights?: string[]
  lastUpdated?: number
}

type ModerationPayload = {
  severity?: string
  tags?: string[]
  matched?: string[]
}

const formatContext = (context: ChatContext | undefined): string => {
  if (!context) {
    return "No additional emotional context provided."
  }

  const sections: string[] = []

  if (context.latestEntry) {
    const {
      date,
      dominantGuna,
      balanceIndex,
      confidence,
      reflection,
      recommendedInterventions,
      metrics,
    } = context.latestEntry

    const metricsSummary = metrics
      ? ` Metrics — clarity ${metrics.clarity ?? "n/a"}, peace ${metrics.peace ?? "n/a"}, energy ${metrics.energy ?? "n/a"}, restlessness ${metrics.restlessness ?? "n/a"}, activity ${metrics.activity ?? "n/a"}, inertia ${metrics.inertia ?? "n/a"}.`
      : ""

    const reflectionSnippet = reflection ? ` Reflection shared: "${reflection}".` : ""
    const interventionSnippet = recommendedInterventions?.length
      ? ` Suggested practices: ${recommendedInterventions.join(", ")}.`
      : ""

    sections.push(
      `Latest check-in (${date}): dominant guna ${dominantGuna}, balance index ${balanceIndex.toFixed(
        1,
      )}, confidence ${confidence}%.${metricsSummary}${reflectionSnippet}${interventionSnippet}`,
    )
  }

  if (context.emotionalSummary) {
    const { dominant, balanceScore, streak, averages } = context.emotionalSummary
    sections.push(
      `Overall trend: balance score ${balanceScore.toFixed(2)}, dominant guna ${dominant ?? "mixed"}, streak ${streak}. Average sattva ${averages.sattva.toFixed(2)}, rajas ${averages.rajas.toFixed(2)}, tamas ${averages.tamas.toFixed(2)}.`,
    )
  }

  if (context.recentEntries?.length) {
    const formatted = context.recentEntries
      .slice(0, 5)
      .map((entry) => {
        const reflection = entry.reflection ? ` Reflection: "${entry.reflection}".` : ""
        return `${entry.date}: dominant ${entry.dominantGuna}, balance ${entry.balanceIndex.toFixed(1)}.${reflection}`
      })
      .join(" \u2022 ")
    sections.push(`Recent check-ins: ${formatted}`)
  }

  if (context.recentReflections?.length) {
    const reflections = context.recentReflections.map((text) => `"${text}"`).join(" | ")
    sections.push(`Notable reflections: ${reflections}`)
  }

  if (context.recommendedInterventions?.length) {
    sections.push(`Highlighted interventions: ${context.recommendedInterventions.join(", ")}`)
  }

  return sections.length ? sections.join("\n") : "No additional emotional context provided."
}

const formatInsights = (insights: ChatInsightsPayload | undefined): string => {
  if (!insights) {
    return "Chat memory summary unavailable."
  }

  const segments: string[] = []

  if (insights.summary) {
    segments.push(`Chat summary: ${insights.summary}`)
  }

  if (insights.themes?.length) {
    segments.push(`Recurring themes: ${insights.themes.join("; ")}`)
  }

  if (insights.highlights?.length) {
    segments.push(`Check-in highlights: ${insights.highlights.join(" | ")}`)
  }

  if (insights.lastUpdated) {
    segments.push(`Insights last refreshed at ${new Date(insights.lastUpdated).toISOString()}.`)
  }

  return segments.length ? segments.join("\n") : "Chat memory summary unavailable."
}

const formatModeration = (moderation: ModerationPayload | undefined): string => {
  if (!moderation) {
    return "No moderation flags detected."
  }

  const { severity, tags, matched } = moderation
  const pieces: string[] = []

  if (severity) {
    pieces.push(`Severity: ${severity}`)
  }

  if (tags?.length) {
    pieces.push(`Tags: ${tags.join(", ")}`)
  }

  if (matched?.length) {
    pieces.push(`Triggered phrases: ${matched.join(", ")}`)
  }

  return pieces.length ? pieces.join(" | ") : "No moderation flags detected."
}

const buildConversationContents = (messages: ChatMessage[]): GeminiContent[] => {
  const recentMessages = messages.slice(-20)

  if (!recentMessages.length) {
    return [
      {
        role: "user",
        parts: [
          {
            text: "Please greet the user warmly as Aaranya and invite them to share what is present for them right now.",
          },
        ],
      },
    ]
  }

  return recentMessages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }))
}

export async function POST(req: Request) {
  const body = await req.json()
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []
  const consentGranted = Boolean(body?.consentGranted)
  const context: ChatContext | undefined = consentGranted ? body?.context : undefined
  const insights: ChatInsightsPayload | undefined = consentGranted ? body?.insights : undefined
  const moderation: ModerationPayload | undefined = body?.moderation

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY environment variable." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const client = new GoogleGenAI({ apiKey })

  const instructionSections = [
    systemPrompt,
    consentGranted
      ? "Consent status: User granted contextual sharing. You may reference their prior reflections when it feels supportive."
      : "Consent status: User declined contextual sharing. Base responses only on the live conversation, not stored memory.",
    `Emotional context summary:\n${formatContext(context)}`,
    `Chat memory notes:\n${formatInsights(insights)}`,
    `Safety considerations:\n${formatModeration(moderation)}`,
    "Guidance: Continue the dialogue in sequence, avoid repeating prior replies verbatim, and close with a gentle invitation or reflective question.",
  ]

  const systemInstruction = instructionSections.filter(Boolean).join("\n\n")

  const contents: GeminiContent[] = [
    { role: "system", parts: [{ text: systemInstruction }] },
    ...buildConversationContents(messages),
  ]

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    })

    const text = (response?.text ?? "").trim()

    if (!text) {
      return new Response(JSON.stringify({ error: "Gemini did not return any text." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ message: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Failed to generate Gemini response", error)
    return new Response(JSON.stringify({ error: "Failed to generate response from Gemini." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
