type SafetyLevel = "immediate" | "watch"

export type SafetyCheckResult = {
  flagged: boolean
  level?: SafetyLevel
  matches: string[]
}

const createPattern = (label: string, pattern: RegExp) => ({ label, pattern })

const immediateRiskPatterns = [
  createPattern("explicit-suicide-intent", /kill myself|end my life|take my life|suicide/i),
  createPattern("self-harm-plan", /hurt myself|cut myself|slice my wrists|jump off/i),
  createPattern("request-for-method", /how to die|best way to die|painless death/i),
  createPattern("farewell-language", /goodbye forever|no reason to live|won't be here/i),
]

const watchlistPatterns = [
  createPattern("overwhelming-hopelessness", /can't go on|can't do this anymore|life is pointless/i),
  createPattern("severe-depression", /severely depressed|feel empty all the time|constant darkness/i),
  createPattern("self-harm-thought", /think about hurting myself|urge to self harm|urge to cut/i),
]

export const checkForCrisisLanguage = (input: string): SafetyCheckResult => {
  const text = input.trim()
  if (!text) {
    return { flagged: false, matches: [] }
  }

  const immediateMatches = immediateRiskPatterns.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label)
  if (immediateMatches.length) {
    return { flagged: true, level: "immediate", matches: immediateMatches }
  }

  const watchMatches = watchlistPatterns.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label)
  if (watchMatches.length) {
    return { flagged: true, level: "watch", matches: watchMatches }
  }

  return { flagged: false, matches: [] }
}

const INDIA_HELPLINES = `• KIRAN (24/7 National Helpline): 1800-599-0019\n• iCall (TISS): 9152987821\n• AASRA: +91-9820466726\n• Snehi: +91-22-2772-6771`

export const buildHelplineResponse = (level: SafetyLevel): string => {
  const intro =
    level === "immediate"
      ? "I'm concerned for your safety. When thoughts feel this heavy, reaching a human supporter right now can help keep you safe."
      : "I'm hearing a lot of pain in what you shared. When things feel overwhelming, talking to someone live can help hold that weight with you."

  return [
    `${intro}\n\nHere are free crisis lines in India:`,
    INDIA_HELPLINES,
    "If you're in immediate danger, please contact local emergency services or someone nearby you trust.",
    "I'll stay here with you, but I want to make sure you're also supported by trained listeners.",
  ].join("\n\n")
}

const ALERT_WEBHOOK = process.env.SAFETY_ALERT_WEBHOOK

export const notifySafetyTeam = async (payload: {
  level: SafetyLevel
  matches: string[]
  message: string
}) => {
  if (!ALERT_WEBHOOK) {
    console.warn("Safety alert detected but SAFETY_ALERT_WEBHOOK is not configured.", payload)
    return
  }

  try {
    await fetch(ALERT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
    })
  } catch (error) {
    console.error("Failed to send safety alert", error)
  }
}
