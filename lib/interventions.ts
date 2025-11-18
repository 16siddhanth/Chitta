import type { LucideIcon } from "lucide-react"
import { Flower2, Wind, Heart, Brain, Sparkles, Flame, Droplet, Moon, Sun } from "lucide-react"

import type { EmotionalEntry, InterventionSession } from "./storage"

export type InterventionType = "breathing" | "meditation" | "journaling" | "movement"
export type InterventionDifficulty = "beginner" | "intermediate" | "advanced"
export type InterventionGuna = EmotionalEntry["dominantGuna"]

export interface InterventionStep {
  id: string
  instruction: string
  duration: number
  type: "instruction" | "practice" | "reflection"
}

export interface InterventionDefinition {
  id: string
  title: string
  description: string
  guna: InterventionGuna
  type: InterventionType
  difficulty: InterventionDifficulty
  totalDuration: number
  visual: "breath" | "gratitude" | "awareness" | "vision" | "alternate-nostril" | "mantra" | "energize" | "body-scan" | "movement"
  steps: InterventionStep[]
}

const interventionRegistry: Record<string, InterventionDefinition> = {
  "calming-breath": {
    id: "calming-breath",
    title: "4-7-8 Calming Breath",
    description: "Activate your relaxation response with this powerful breathing pattern",
    guna: "rajas",
    type: "breathing",
    difficulty: "beginner",
    totalDuration: 180,
    visual: "breath",
    steps: [
      {
        id: "intro",
        instruction:
          "Find a comfortable seated position. Place one hand on your chest and one on your belly. We'll practice the 4-7-8 breathing technique to calm your nervous system.",
        duration: 15,
        type: "instruction",
      },
      {
        id: "demo",
        instruction:
          "Let's start with a demonstration. Breathe in through your nose for 4 counts, hold for 7 counts, then exhale through your mouth for 8 counts.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "practice1",
        instruction:
          "Inhale through your nose... 1, 2, 3, 4. Now hold your breath... 1, 2, 3, 4, 5, 6, 7. Exhale slowly through your mouth... 1, 2, 3, 4, 5, 6, 7, 8.",
        duration: 25,
        type: "practice",
      },
      {
        id: "practice2",
        instruction:
          "Continue this rhythm. Inhale for 4... Hold for 7... Exhale for 8. Feel your body beginning to relax with each cycle.",
        duration: 60,
        type: "practice",
      },
      {
        id: "practice3",
        instruction:
          "Keep going at your own pace. Notice how your heart rate begins to slow and your mind becomes calmer.",
        duration: 45,
        type: "practice",
      },
      {
        id: "reflection",
        instruction:
          "Take a moment to notice how you feel now compared to when you started. Return to natural breathing and rest in this calm state.",
        duration: 15,
        type: "reflection",
      },
    ],
  },
  "gratitude-reflection": {
    id: "gratitude-reflection",
    title: "Gratitude Reflection",
    description: "Cultivate appreciation and positive awareness through guided gratitude practice",
    guna: "sattva",
    type: "journaling",
    difficulty: "beginner",
    totalDuration: 300,
    visual: "gratitude",
    steps: [
      {
        id: "intro",
        instruction:
          "Settle into a comfortable position and take three deep breaths. We'll explore gratitude as a pathway to inner peace and clarity.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "body-gratitude",
        instruction:
          "Begin by appreciating your body. Thank your heart for beating, your lungs for breathing, your eyes for seeing. Feel genuine appreciation for this vessel that carries you through life.",
        duration: 60,
        type: "practice",
      },
      {
        id: "relationships",
        instruction:
          "Now bring to mind someone you're grateful for. It could be family, a friend, or even a stranger who showed kindness. Feel the warmth of appreciation in your heart.",
        duration: 60,
        type: "practice",
      },
      {
        id: "experiences",
        instruction:
          "Think of three experiences from today or this week that brought you joy, learning, or growth. Even small moments count - a warm cup of tea, a beautiful sunset, a moment of laughter.",
        duration: 90,
        type: "practice",
      },
      {
        id: "challenges",
        instruction:
          "Consider a recent challenge. Can you find something to appreciate about it - perhaps the strength it revealed in you, or the lesson it offered?",
        duration: 45,
        type: "practice",
      },
      {
        id: "closing",
        instruction:
          "Rest in this feeling of gratitude. Let it fill your entire being. When you're ready, gently open your eyes, carrying this appreciation with you.",
        duration: 25,
        type: "reflection",
      },
    ],
  },
  "mindful-awareness": {
    id: "mindful-awareness",
    title: "Mindful Awareness",
    description: "Deepen your present moment awareness with gentle mindfulness meditation",
    guna: "sattva",
    type: "meditation",
    difficulty: "beginner",
    totalDuration: 420,
    visual: "awareness",
    steps: [
      {
        id: "intro",
        instruction:
          "Sit comfortably with your spine straight but not stiff. Close your eyes gently. We'll practice simple present-moment awareness.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "breath-anchor",
        instruction:
          "Bring your attention to your natural breath. Notice where you feel it most - the nose, chest, or belly. No need to change it, just observe.",
        duration: 60,
        type: "practice",
      },
      {
        id: "body-awareness",
        instruction:
          "Expand awareness to your whole body. Notice any sensations - warmth, coolness, tingling, tension. Simply observe without judgment.",
        duration: 90,
        type: "practice",
      },
      {
        id: "sounds",
        instruction:
          "Now notice sounds around you. Near and far. Let them come and go like waves. You don't need to label them, just hear them.",
        duration: 60,
        type: "practice",
      },
      {
        id: "thoughts",
        instruction:
          "Notice thoughts arising in your mind. Like clouds passing through sky. When you notice you've been caught in a thought, gently return to breath.",
        duration: 120,
        type: "practice",
      },
      {
        id: "integration",
        instruction:
          "Take three deep breaths. Notice the clarity and spaciousness in your awareness. Slowly open your eyes when ready.",
        duration: 70,
        type: "reflection",
      },
    ],
  },
  "vision-clarity": {
    id: "vision-clarity",
    title: "Vision Clarity",
    description: "Connect with your deeper purpose and aspirations through guided visualization",
    guna: "sattva",
    type: "meditation",
    difficulty: "intermediate",
    totalDuration: 360,
    visual: "vision",
    steps: [
      {
        id: "intro",
        instruction:
          "Find a quiet, comfortable space. Close your eyes and take five deep, settling breaths. We'll connect with your inner vision and purpose.",
        duration: 30,
        type: "instruction",
      },
      {
        id: "present-self",
        instruction:
          "Visualize yourself right now, in this moment. See yourself clearly - your strengths, your challenges, your current path. Accept what you see with compassion.",
        duration: 60,
        type: "practice",
      },
      {
        id: "future-vision",
        instruction:
          "Now imagine yourself six months from now, living in alignment with your deepest values. What does that look like? What are you doing? How do you feel?",
        duration: 90,
        type: "practice",
      },
      {
        id: "obstacles",
        instruction:
          "Notice any obstacles or fears that arise. Acknowledge them without judgment. What inner resources do you have to work with these challenges?",
        duration: 60,
        type: "practice",
      },
      {
        id: "next-step",
        instruction:
          "What is one small, concrete step you can take today toward that vision? See yourself taking that step with confidence.",
        duration: 60,
        type: "practice",
      },
      {
        id: "closing",
        instruction:
          "Place your hand on your heart. Feel gratitude for this clarity. Slowly return to the room, bringing this vision with you.",
        duration: 60,
        type: "reflection",
      },
    ],
  },
  "alternate-nostril": {
    id: "alternate-nostril",
    title: "Alternate Nostril Breathing",
    description: "Balance your nervous system with this traditional pranayama technique",
    guna: "rajas",
    type: "breathing",
    difficulty: "intermediate",
    totalDuration: 240,
    visual: "alternate-nostril",
    steps: [
      {
        id: "intro",
        instruction:
          "Sit with a straight spine. We'll practice Nadi Shodhana (alternate nostril breathing) to balance left and right energy channels.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "hand-position",
        instruction:
          "Bring your right hand to your face. Use your thumb to close your right nostril and your ring finger to close your left. Your index and middle fingers can rest gently on your forehead.",
        duration: 25,
        type: "instruction",
      },
      {
        id: "first-round",
        instruction:
          "Close your right nostril with your thumb. Inhale slowly through your left nostril for 4 counts. Now close both nostrils and hold for 4 counts. Release your thumb and exhale through your right nostril for 4 counts.",
        duration: 40,
        type: "practice",
      },
      {
        id: "continue-pattern",
        instruction:
          "Now inhale through the right nostril for 4, hold for 4, close right and exhale through left for 4. This completes one full cycle. Continue this pattern.",
        duration: 120,
        type: "practice",
      },
      {
        id: "deepening",
        instruction:
          "If comfortable, extend to 5 counts in, 5 hold, 5 out. Maintain steady, smooth breath.",
        duration: 25,
        type: "practice",
      },
      {
        id: "closing",
        instruction:
          "Complete your last exhale through the left nostril. Release your hand and breathe naturally. Notice the balance and calm.",
        duration: 10,
        type: "reflection",
      },
    ],
  },
  "focus-mantra": {
    id: "focus-mantra",
    title: "Focus Mantra Meditation",
    description: "Channel restless energy into concentrated awareness with sacred sounds",
    guna: "rajas",
    type: "meditation",
    difficulty: "beginner",
    totalDuration: 300,
    visual: "mantra",
    steps: [
      {
        id: "intro",
        instruction:
          "Sit comfortably with your spine tall. We'll use a simple mantra to anchor your scattered energy into focused presence.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "choose-mantra",
        instruction:
          "Choose a mantra that resonates: 'Om' for universal connection, 'So Ham' (I am), 'Peace', or any word that feels right. We'll use 'Om' for this practice.",
        duration: 30,
        type: "instruction",
      },
      {
        id: "silent-repetition",
        instruction:
          "Close your eyes. Begin repeating 'Om' silently in your mind, matching it with your breath. Inhale 'Om', exhale 'Om'. Let the sound fill your awareness.",
        duration: 120,
        type: "practice",
      },
      {
        id: "when-distracted",
        instruction:
          "When your mind wanders (and it will), simply notice and gently return to the mantra. No judgment. This returning IS the practice.",
        duration: 80,
        type: "practice",
      },
      {
        id: "deepen",
        instruction:
          "Let the mantra become softer, subtler, almost like a gentle vibration rather than words. Rest in that space.",
        duration: 40,
        type: "practice",
      },
      {
        id: "closing",
        instruction:
          "Let the mantra fade. Sit in silence for a few breaths. Notice the focused calm you've created. Slowly open your eyes.",
        duration: 10,
        type: "reflection",
      },
    ],
  },
  "energizing-breath": {
    id: "energizing-breath",
    title: "Energizing Breath Work",
    description: "Awaken your vital energy with invigorating breathing techniques",
    guna: "tamas",
    type: "breathing",
    difficulty: "beginner",
    totalDuration: 240,
    visual: "energize",
    steps: [
      {
        id: "intro",
        instruction:
          "Sit up tall with your spine straight. We'll use breath to awaken your natural vitality and clear mental fog.",
        duration: 15,
        type: "instruction",
      },
      {
        id: "bellows-prep",
        instruction:
          "We'll practice Bellows Breath (Bhastrika). Place your hands on your knees. This involves rapid, forceful breathing to energize your system.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "bellows-practice",
        instruction:
          "Take 10 rapid, forceful breaths in and out through your nose. Pump your belly like a bellows. Then take a deep breath in, hold for 5 seconds, and exhale slowly.",
        duration: 45,
        type: "practice",
      },
      {
        id: "bellows-repeat",
        instruction:
          "Let's do another round. 10 more rapid breaths, pumping energy through your system. Then hold and release slowly.",
        duration: 45,
        type: "practice",
      },
      {
        id: "sun-breath",
        instruction:
          "Now we'll do Sun Breath. Inhale and sweep your arms up overhead, exhale and bring them down. Feel yourself gathering energy from above.",
        duration: 60,
        type: "practice",
      },
      {
        id: "integration",
        instruction:
          "Return to normal breathing. Notice the energy flowing through your body. Feel more alert, awake, and ready to engage with your day.",
        duration: 55,
        type: "reflection",
      },
    ],
  },
  "body-scan-activation": {
    id: "body-scan-activation",
    title: "Body Scan Activation",
    description: "Gently awaken your body's energy centers through mindful scanning",
    guna: "tamas",
    type: "meditation",
    difficulty: "beginner",
    totalDuration: 360,
    visual: "body-scan",
    steps: [
      {
        id: "intro",
        instruction:
          "Lie down or sit comfortably. We'll move awareness through your body, awakening each area and releasing stagnant energy.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "feet",
        instruction:
          "Bring attention to your feet. Wiggle your toes. Imagine warm, golden light filling your feet, awakening them.",
        duration: 40,
        type: "practice",
      },
      {
        id: "legs",
        instruction:
          "Move awareness up through ankles, calves, knees, thighs. Tense and release each area. Feel vitality flowing upward.",
        duration: 60,
        type: "practice",
      },
      {
        id: "core",
        instruction:
          "Scan through your pelvis, belly, lower back. Take a deep breath into your abdomen. Feel the solar plexus (your power center) glowing with energy.",
        duration: 60,
        type: "practice",
      },
      {
        id: "chest-arms",
        instruction:
          "Move to your chest and heart space. Roll your shoulders. Stretch your arms. Feel energy radiating from your heart center down through your fingers.",
        duration: 60,
        type: "practice",
      },
      {
        id: "head",
        instruction:
          "Scan neck, jaw, face, scalp. Relax any tension. Imagine bright light at the crown of your head, connecting you to clarity and purpose.",
        duration: 60,
        type: "practice",
      },
      {
        id: "whole-body",
        instruction:
          "Feel your entire body alive and energized. Take three deep breaths. Stretch gently. Notice how much more awake and present you feel.",
        duration: 60,
        type: "reflection",
      },
    ],
  },
  "gentle-movement": {
    id: "gentle-movement",
    title: "Gentle Movement Flow",
    description: "Light, mindful movements to shift stagnant energy and increase vitality",
    guna: "tamas",
    type: "movement",
    difficulty: "beginner",
    totalDuration: 420,
    visual: "movement",
    steps: [
      {
        id: "intro",
        instruction:
          "Stand with feet hip-width apart. We'll move through gentle stretches and flows to wake up your body and shift heavy energy.",
        duration: 20,
        type: "instruction",
      },
      {
        id: "neck-shoulders",
        instruction:
          "Start with neck rolls - slow circles in each direction. Then shoulder rolls backward, opening your chest. Roll forward, releasing tension.",
        duration: 60,
        type: "practice",
      },
      {
        id: "side-stretch",
        instruction:
          "Reach your right arm overhead and lean gently to the left. Feel the stretch along your right side. Hold for a few breaths. Repeat on the other side.",
        duration: 60,
        type: "practice",
      },
      {
        id: "twists",
        instruction:
          "Place hands on hips. Gently twist your torso to the right, then left. Let your arms swing naturally. Feel your spine releasing.",
        duration: 60,
        type: "practice",
      },
      {
        id: "forward-fold",
        instruction:
          "Hinge at your hips and fold forward gently. Let your head and arms hang. Bend your knees if needed. Sway side to side. Feel gravity releasing tension.",
        duration: 60,
        type: "practice",
      },
      {
        id: "cat-cow",
        instruction:
          "If comfortable, come to hands and knees. Arch your back (cow pose) on an inhale. Round your spine (cat pose) on an exhale. Flow between these.",
        duration: 80,
        type: "practice",
      },
      {
        id: "standing-flow",
        instruction:
          "Return to standing. Reach arms up on inhale, fold down on exhale. Repeat this simple flow 5 times, matching movement with breath.",
        duration: 60,
        type: "practice",
      },
      {
        id: "closing",
        instruction:
          "Stand in mountain pose. Feel your feet rooted, your spine tall. Take three deep breaths. Notice the vitality and lightness in your body.",
        duration: 20,
        type: "reflection",
      },
    ],
  },
}

export type InterventionPresetMeta = {
  icon: LucideIcon
  title: string
  subtitle: string
  duration?: string
}

export const INTERVENTION_PRESETS: Record<string, InterventionPresetMeta> = {
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

export const INTERVENTIONS = Object.values(interventionRegistry)

export const getInterventionDefinition = (id: string): InterventionDefinition | undefined => interventionRegistry[id]

export const formatDurationLabel = (totalSeconds: number): string => {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }
  const minutes = Math.round(totalSeconds / 60)
  return `${minutes} min`
}

export const getInterventionMeta = (id: string) => {
  const definition = getInterventionDefinition(id)
  if (!definition) return undefined
  return {
    id: definition.id,
    title: definition.title,
    guna: definition.guna,
    type: definition.type,
    difficulty: definition.difficulty,
    totalDuration: definition.totalDuration,
    durationLabel: formatDurationLabel(definition.totalDuration),
  }
}

export type InterventionScriptureReference = {
  source: string
  verses: string[]
  theme: string
  summary: string
}

export const INTERVENTION_SCRIPTURE_REFERENCES: Record<string, InterventionScriptureReference> = {
  "gratitude-reflection": {
    source: "Bhagavad Gita",
    verses: ["17.15", "10.41"],
    theme: "Speech that is truthful, pleasant, and honours the sacred in everyone",
    summary:
      "Encourages appreciative journaling so sattvic speech (satya, priya) steadies the heart before action.",
  },
  "mindful-awareness": {
    source: "Bhagavad Gita",
    verses: ["6.10", "6.26"],
    theme: "Seated meditation that repeatedly returns the mind to still awareness",
    summary: "Guides dharana/dhyana by noticing distraction and gently returning to breath anchored presence.",
  },
  "vision-clarity": {
    source: "Bhagavad Gita",
    verses: ["2.41", "18.45"],
    theme: "Single-pointed purpose aligned with one’s swadharma",
    summary: "Visualization session reconnects the practitioner with steady intention so sattva can lead decisions.",
  },
  "alternate-nostril": {
    source: "Bhagavad Gita",
    verses: ["4.29", "5.27-28"],
    theme: "Pranayama that balances prana and withdraws the senses before contemplation",
    summary: "Structured nostril alternation channels rajasic spikes into a balanced, inward turning current.",
  },
  "calming-breath": {
    source: "Bhagavad Gita",
    verses: ["4.29"],
    theme: "Breath offered as a sacrificial act to quiet the nervous system",
    summary: "Lengthening the exhale follows the Gita’s pranayama guidance to settle the fire of rajas.",
  },
  "focus-mantra": {
    source: "Bhagavad Gita",
    verses: ["8.13", "9.14"],
    theme: "Japa of Om with unwavering devotion",
    summary: "Transforms rajasic drive into mantra repetition so awareness rests on a single vibration.",
  },
  "energizing-breath": {
    source: "Bhagavad Gita",
    verses: ["3.30", "6.16-17"],
    theme: "Disciplined action and moderated habits to overcome inertia",
    summary: "Invigorating breath and movement disperse tamasic heaviness while staying aligned with purposeful effort.",
  },
  "body-scan-activation": {
    source: "Bhagavad Gita",
    verses: ["6.11-13"],
    theme: "Awareness traveling the body from root to crown in a steady posture",
    summary: "Sequential attention awakens each locus of energy so tamas can lift without agitation.",
  },
  "gentle-movement": {
    source: "Bhagavad Gita",
    verses: ["3.7", "6.16"],
    theme: "Mindful action offered without attachment",
    summary: "Light movement practices invite rajasic vitality to break tamasic inertia while honoring moderation.",
  },
}

export const getInterventionScriptureReference = (id: string) => INTERVENTION_SCRIPTURE_REFERENCES[id]

export const getInterventionPalette = (guna: InterventionGuna) => {
  switch (guna) {
    case "sattva":
      return { accent: "secondary", surface: "bg-secondary/10", text: "text-secondary" }
    case "rajas":
      return { accent: "primary", surface: "bg-primary/10", text: "text-primary" }
    case "tamas":
    default:
      return { accent: "muted-foreground", surface: "bg-muted-foreground/10", text: "text-muted-foreground" }
  }
}

export type InterventionAnalytics = {
  completedThisWeek: number
  totalMinutesThisWeek: number
  topGuna?: InterventionGuna
  topType?: InterventionType
  lastSession?: {
    id: string
    interventionId: string
    completedAt: number
    duration: number
    rating?: number
    definition?: InterventionDefinition
  }
}

const topKey = <T extends string>(map: Map<T, number>): T | undefined => {
  let result: T | undefined
  let highest = -1
  for (const [key, count] of map) {
    if (count > highest) {
      result = key
      highest = count
    }
  }
  return result
}

export const analyseInterventionSessions = (
  sessions: InterventionSession[],
  windowDays = 7,
): InterventionAnalytics => {
  if (!sessions.length) {
    return { completedThisWeek: 0, totalMinutesThisWeek: 0 }
  }

  const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000
  const recent = sessions.filter((session) => session.completedAt >= cutoff)

  if (!recent.length) {
    const [latestSession] = [...sessions].sort((a, b) => b.completedAt - a.completedAt)
    return {
      completedThisWeek: 0,
      totalMinutesThisWeek: 0,
      lastSession: latestSession
        ? {
            ...latestSession,
            definition: getInterventionDefinition(latestSession.interventionId),
          }
        : undefined,
    }
  }

  const byGuna = new Map<InterventionGuna, number>()
  const byType = new Map<InterventionType, number>()

  let totalSeconds = 0

  for (const session of recent) {
    totalSeconds += session.duration
    const definition = getInterventionDefinition(session.interventionId)
    if (definition) {
      byGuna.set(definition.guna, (byGuna.get(definition.guna) ?? 0) + 1)
      byType.set(definition.type, (byType.get(definition.type) ?? 0) + 1)
    }
  }

  const latestSession = recent.sort((a, b) => b.completedAt - a.completedAt)[0]

  return {
    completedThisWeek: recent.length,
    totalMinutesThisWeek: Math.round(totalSeconds / 60),
    topGuna: topKey(byGuna),
    topType: topKey(byType),
    lastSession: latestSession
      ? {
          ...latestSession,
          definition: getInterventionDefinition(latestSession.interventionId),
        }
      : undefined,
  }
}