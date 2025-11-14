"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createEntryFromCheckIn } from "@/lib/emotional-model"
import { saveEmotionalEntry } from "@/lib/storage"

interface EmotionalState {
  clarity: number
  energy: number
  peace: number
  restlessness: number
  activity: number
  inertia: number
  reflection: string
}

const questions = [
  {
    id: "clarity",
    title: "Mental Clarity",
    description: "How clear and focused is your mind today?",
    guna: "sattva",
    lowLabel: "Foggy, confused",
    highLabel: "Crystal clear, focused",
  },
  {
    id: "peace",
    title: "Inner Peace",
    description: "How peaceful and calm do you feel?",
    guna: "sattva",
    lowLabel: "Agitated, disturbed",
    highLabel: "Deeply peaceful, serene",
  },
  {
    id: "energy",
    title: "Energy Level",
    description: "How would you describe your energy today?",
    guna: "rajas",
    lowLabel: "Lethargic, drained",
    highLabel: "Vibrant, energetic",
  },
  {
    id: "restlessness",
    title: "Restlessness",
    description: "How restless or agitated do you feel?",
    guna: "rajas",
    lowLabel: "Completely calm",
    highLabel: "Very restless, can't sit still",
  },
  {
    id: "activity",
    title: "Desire for Activity",
    description: "How much do you want to be active and engaged?",
    guna: "rajas",
    lowLabel: "No motivation to act",
    highLabel: "Strong drive to be active",
  },
  {
    id: "inertia",
    title: "Mental Inertia",
    description: "How much mental heaviness or dullness do you experience?",
    guna: "tamas",
    lowLabel: "Light, alert mind",
    highLabel: "Heavy, sluggish thinking",
  },
] as const

type QuestionId = (typeof questions)[number]["id"]

export default function EmotionalMappingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    clarity: 50,
    energy: 50,
    peace: 50,
    restlessness: 50,
    activity: 50,
    inertia: 50,
    reflection: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isPending, startTransition] = useTransition()

  const totalSteps = questions.length + 1
  const isLastStep = currentStep === questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const isSubmitting = isSaving || isPending

  const updateState = (key: QuestionId | "reflection", value: number | string) => {
    setEmotionalState((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => Math.min(prev + 1, questions.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    const raw = {
      clarity: emotionalState.clarity,
      peace: emotionalState.peace,
      energy: emotionalState.energy,
      restlessness: emotionalState.restlessness,
      activity: emotionalState.activity,
      inertia: emotionalState.inertia,
      reflection: emotionalState.reflection,
    }

    try {
      setIsSaving(true)
      const { payload } = createEntryFromCheckIn(raw)
      await saveEmotionalEntry(payload)
      startTransition(() => {
        router.replace("/insights/latest")
      })
    } catch (error) {
      console.error("Failed to save check-in", error)
      alert("Something went wrong while saving your check-in. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const renderSliderCard = () => {
    const question = questions[currentStep]
    const value = emotionalState[question.id]

    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {question.guna.charAt(0).toUpperCase() + question.guna.slice(1)}
            </Badge>
          </div>
          <CardTitle className="font-serif">{question.title}</CardTitle>
          <CardDescription>{question.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <Slider
                value={[value]}
                onValueChange={(next) => updateState(question.id, next[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{question.lowLabel}</span>
                <span>{question.highLabel}</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">{value}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderReflectionCard = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-serif">Final Reflection</CardTitle>
        <CardDescription>Capture any insights, emotions, or observations from today</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="How are you feeling today? Any thoughts or observations you want to remember?"
          value={emotionalState.reflection}
          onChange={(event) => updateState("reflection", event.target.value)}
          className="min-h-[120px]"
        />
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold">Daily Emotional Check-in</h1>
              <p className="text-sm text-muted-foreground">Tune in, reflect, and save your inner landscape</p>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {isLastStep ? renderReflectionCard() : renderSliderCard()}

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 0 || isSubmitting}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {isLastStep ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Complete Check-in
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={isSubmitting} className="w-full sm:w-auto">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
