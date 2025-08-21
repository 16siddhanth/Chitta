"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface InterventionStep {
  id: string
  instruction: string
  duration: number
  type: "instruction" | "practice" | "reflection"
}

const interventionData: Record<
  string,
  {
    title: string
    description: string
    guna: string
    totalDuration: number
    steps: InterventionStep[]
  }
> = {
  "calming-breath": {
    title: "4-7-8 Calming Breath",
    description: "Activate your relaxation response with this powerful breathing pattern",
    guna: "rajas",
    totalDuration: 180, // 3 minutes in seconds
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
    title: "Gratitude Reflection",
    description: "Cultivate appreciation and positive awareness through guided gratitude practice",
    guna: "sattva",
    totalDuration: 300, // 5 minutes
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
  "energizing-breath": {
    title: "Energizing Breath Work",
    description: "Awaken your vital energy with invigorating breathing techniques",
    guna: "tamas",
    totalDuration: 240, // 4 minutes
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
}

export default function InterventionDetailPage() {
  const params = useParams()
  const interventionId = params.id as string
  const intervention = interventionData[interventionId]

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (intervention) {
      setTimeRemaining(intervention.steps[0].duration)
    }
  }, [intervention])

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next step
            if (currentStepIndex < intervention.steps.length - 1) {
              const nextStep = currentStepIndex + 1
              setCurrentStepIndex(nextStep)
              return intervention.steps[nextStep].duration
            } else {
              // Complete the intervention
              setIsComplete(true)
              setIsPlaying(false)
              return 0
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, timeRemaining, currentStepIndex, intervention])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setTimeRemaining(intervention.steps[0].duration)
    setIsComplete(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const totalProgress = intervention
    ? (currentStepIndex * 100 +
        ((intervention.steps[currentStepIndex].duration - timeRemaining) /
          intervention.steps[currentStepIndex].duration) *
          100) /
      intervention.steps.length
    : 0

  if (!intervention) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif font-bold text-2xl mb-4">Intervention Not Found</h1>
            <Link href="/interventions">
              <Button>Back to Interventions</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="font-serif text-2xl">Practice Complete!</CardTitle>
                <CardDescription>You've completed the {intervention.title} intervention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Take a moment to notice how you feel now. Your dedication to self-care is commendable.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleReset} variant="outline">
                    Practice Again
                  </Button>
                  <Link href="/interventions">
                    <Button>Explore More</Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="secondary">Chat with Aaranya</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const currentStep = intervention.steps[currentStepIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/interventions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-bold text-2xl">{intervention.title}</h1>
              <p className="text-muted-foreground">{intervention.description}</p>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Progress</span>
                <Badge variant="secondary">
                  Step {currentStepIndex + 1} of {intervention.steps.length}
                </Badge>
              </div>
              <Progress value={totalProgress} className="h-2 mb-4" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Time remaining: {formatTime(timeRemaining)}</span>
                <span>{Math.round(totalProgress)}% complete</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Step */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    currentStep.type === "instruction"
                      ? "secondary"
                      : currentStep.type === "practice"
                        ? "default"
                        : "outline"
                  }
                >
                  {currentStep.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed mb-6">{currentStep.instruction}</p>

              {/* Visual breathing guide for breathing exercises */}
              {intervention.guna === "rajas" && currentStep.type === "practice" && (
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center transition-all duration-1000 ${
                      isPlaying ? "scale-110 border-primary" : "scale-100"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-primary/20 transition-all duration-2000 ${
                        isPlaying ? "scale-75" : "scale-100"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button onClick={handlePlayPause} size="lg" className="px-8">
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {currentStepIndex === 0 && timeRemaining === intervention.steps[0].duration ? "Start" : "Resume"}
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
