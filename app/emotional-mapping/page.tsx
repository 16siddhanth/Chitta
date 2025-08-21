"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

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
]

export default function EmotionalMappingPage() {
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
  const [isComplete, setIsComplete] = useState(false)

  const updateState = (key: keyof EmotionalState, value: number | string) => {
    setEmotionalState((prev) => ({ ...prev, [key]: value }))
  }

  const calculateGunas = () => {
    const sattva = (emotionalState.clarity + emotionalState.peace) / 2
    const rajas = (emotionalState.energy + emotionalState.restlessness + emotionalState.activity) / 3
    const tamas = emotionalState.inertia

    return { sattva, rajas, tamas }
  }

  const getDominantGuna = () => {
    const gunas = calculateGunas()
    const max = Math.max(gunas.sattva, gunas.rajas, gunas.tamas)

    if (max === gunas.sattva) return "sattva"
    if (max === gunas.rajas) return "rajas"
    return "tamas"
  }

  const getGunaDescription = (guna: string) => {
    switch (guna) {
      case "sattva":
        return {
          name: "Sattva",
          description: "Clarity, peace, and harmony dominate your current state",
          color: "bg-secondary",
          recommendations: [
            "Maintain this balance through meditation",
            "Practice gratitude",
            "Engage in creative activities",
          ],
        }
      case "rajas":
        return {
          name: "Rajas",
          description: "Activity, passion, and restlessness are prominent",
          color: "bg-primary",
          recommendations: [
            "Try calming breathwork",
            "Practice mindful movement",
            "Channel energy into purposeful action",
          ],
        }
      case "tamas":
        return {
          name: "Tamas",
          description: "Inertia, heaviness, and dullness are present",
          color: "bg-muted",
          recommendations: ["Gentle movement or yoga", "Energizing breathwork", "Exposure to natural light"],
        }
      default:
        return { name: "", description: "", color: "", recommendations: [] }
    }
  }

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100

  if (isComplete) {
    const dominantGuna = getDominantGuna()
    const gunaInfo = getGunaDescription(dominantGuna)
    const gunas = calculateGunas()

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div>
                <h1 className="font-serif font-bold text-2xl">Your Emotional Map</h1>
                <p className="text-muted-foreground">Today's reflection complete</p>
              </div>
            </div>

            {/* Results */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-serif">Dominant Guna: {gunaInfo.name}</CardTitle>
                <CardDescription>{gunaInfo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Guna Breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sattva (Clarity & Peace)</span>
                      <span className="text-sm text-muted-foreground">{Math.round(gunas.sattva)}%</span>
                    </div>
                    <Progress value={gunas.sattva} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rajas (Activity & Passion)</span>
                      <span className="text-sm text-muted-foreground">{Math.round(gunas.rajas)}%</span>
                    </div>
                    <Progress value={gunas.rajas} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tamas (Inertia & Rest)</span>
                      <span className="text-sm text-muted-foreground">{Math.round(gunas.tamas)}%</span>
                    </div>
                    <Progress value={gunas.tamas} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-serif">Personalized Recommendations</CardTitle>
                <CardDescription>Based on your current emotional state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gunaInfo.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reflection */}
            {emotionalState.reflection && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="font-serif">Your Reflection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{emotionalState.reflection}</p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1">Explore Micro-Interventions</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Chat with Aaranya
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-bold text-2xl">Daily Emotional Check-in</h1>
              <p className="text-muted-foreground">Reflect on your inner state</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} of {questions.length + 1}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question or Reflection */}
          {currentStep < questions.length ? (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {questions[currentStep].guna.charAt(0).toUpperCase() + questions[currentStep].guna.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="font-serif">{questions[currentStep].title}</CardTitle>
                <CardDescription>{questions[currentStep].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Slider
                      value={[emotionalState[questions[currentStep].id as keyof EmotionalState] as number]}
                      onValueChange={(value) =>
                        updateState(questions[currentStep].id as keyof EmotionalState, value[0])
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{questions[currentStep].lowLabel}</span>
                      <span>{questions[currentStep].highLabel}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {emotionalState[questions[currentStep].id as keyof EmotionalState]}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-serif">Final Reflection</CardTitle>
                <CardDescription>
                  Take a moment to reflect on anything else about your emotional state today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How are you feeling today? Any thoughts, insights, or observations about your emotional state..."
                  value={emotionalState.reflection}
                  onChange={(e) => updateState("reflection", e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep < questions.length ? "Next" : "Complete Check-in"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
