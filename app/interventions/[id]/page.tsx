"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Sparkles,
  Heart,
  Eye,
  Wind,
  Sun,
  Brain,
  Music2,
  MoveRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  getInterventionDefinition,
  getInterventionPalette,
  formatDurationLabel,
  type InterventionDefinition,
  type InterventionStep,
} from "@/lib/interventions"
import { saveInterventionSession } from "@/lib/storage"

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const visualBackgrounds: Record<InterventionDefinition["visual"], string> = {
  breath: "radial-gradient(circle at 30% 30%, rgba(161, 98, 7, 0.22), transparent 60%), radial-gradient(circle at 70% 65%, rgba(99, 102, 241, 0.28), transparent 70%)",
  gratitude:
    "radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.25), transparent 65%), radial-gradient(circle at 75% 55%, rgba(250, 204, 21, 0.3), transparent 70%)",
  awareness:
    "radial-gradient(circle at 30% 25%, rgba(99, 102, 241, 0.28), transparent 65%), radial-gradient(circle at 70% 70%, rgba(244, 114, 182, 0.15), transparent 70%)",
  vision:
    "radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.24), transparent 65%), radial-gradient(circle at 70% 60%, rgba(161, 98, 7, 0.28), transparent 70%)",
  "alternate-nostril":
    "radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.24), transparent 60%), radial-gradient(circle at 80% 60%, rgba(99, 102, 241, 0.22), transparent 70%)",
  mantra:
    "radial-gradient(circle at 28% 28%, rgba(161, 98, 7, 0.24), transparent 60%), radial-gradient(circle at 68% 70%, rgba(236, 72, 153, 0.2), transparent 70%)",
  energize:
    "radial-gradient(circle at 20% 20%, rgba(250, 204, 21, 0.32), transparent 60%), radial-gradient(circle at 80% 70%, rgba(161, 98, 7, 0.28), transparent 70%)",
  "body-scan":
    "radial-gradient(circle at 25% 30%, rgba(56, 189, 248, 0.2), transparent 60%), radial-gradient(circle at 75% 65%, rgba(161, 98, 7, 0.24), transparent 70%)",
  movement:
    "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.22), transparent 60%), radial-gradient(circle at 78% 65%, rgba(34, 197, 94, 0.22), transparent 70%)",
}

const iconForVisual = (visual: InterventionDefinition["visual"]) => {
  switch (visual) {
    case "gratitude":
      return <Heart className="h-12 w-12 text-secondary" />
    case "awareness":
      return <Sparkles className="h-12 w-12 text-secondary" />
    case "vision":
      return <Eye className="h-12 w-12 text-primary" />
    case "alternate-nostril":
      return <Wind className="h-12 w-12 text-primary" />
    case "mantra":
      return <Music2 className="h-12 w-12 text-primary" />
    case "energize":
      return <Sun className="h-12 w-12 text-primary" />
    case "body-scan":
      return <Brain className="h-12 w-12 text-secondary" />
    case "movement":
      return <MoveRight className="h-12 w-12 text-primary" />
    case "breath":
    default:
      return <Wind className="h-12 w-12 text-primary" />
  }
}

const stepBadgeVariant = (type: InterventionStep["type"]): "default" | "outline" | "secondary" => {
  switch (type) {
    case "instruction":
      return "secondary"
    case "reflection":
      return "outline"
    case "practice":
    default:
      return "default"
  }
}

const VisualDisplay = ({
  intervention,
  isPlaying,
  currentStep,
}: {
  intervention: InterventionDefinition
  isPlaying: boolean
  currentStep?: InterventionStep
}) => {
  if (!intervention) return null

  if (intervention.visual === "breath") {
    const isActive = isPlaying && currentStep?.type === "practice"
    return (
      <div
        className={`relative mx-auto mb-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-gradient-to-br from-card/80 via-background/80 to-card/80 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.55)] ${
          isPlaying ? "animate-soft-float" : ""
        }`}
      >
        <div
          className={`absolute inset-3 rounded-full border border-primary/30 bg-primary/10 transition-opacity duration-700 ${
            isActive ? "opacity-100 animate-slow-pulse" : "opacity-70"
          }`}
        />
        <div
          className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-background/80 shadow-inner transition-transform duration-700 ${
            isActive ? "scale-110" : "scale-95"
          }`}
        >
          {iconForVisual("breath")}
        </div>
      </div>
    )
  }

  const background = visualBackgrounds[intervention.visual]
  return (
    <div
      className={`relative mx-auto mb-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border border-border/60 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.6)] ${
        isPlaying ? "animate-soft-float" : ""
      }`}
      style={background ? { backgroundImage: background } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-card/75 via-background/65 to-card/80 backdrop-blur-sm" />
      <div
        className={`absolute -inset-6 opacity-40 ${isPlaying ? "animate-rotate-glow" : ""}`}
        style={background ? { backgroundImage: background } : undefined}
      />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background/85 shadow-inner">
        {iconForVisual(intervention.visual)}
      </div>
    </div>
  )
}

export default function InterventionDetailPage() {
  const params = useParams()
  const interventionId = params.id as string
  const intervention = useMemo(() => getInterventionDefinition(interventionId), [interventionId])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [sessionLogged, setSessionLogged] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!intervention) return
    setCurrentStepIndex(0)
    setTimeRemaining(intervention.steps[0]?.duration ?? 0)
    setIsComplete(false)
    setSessionLogged(false)
    setIsPlaying(false)
  }, [intervention])

  useEffect(() => {
    if (!intervention) return

    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (currentStepIndex < intervention.steps.length - 1) {
              const nextStepIndex = currentStepIndex + 1
              setCurrentStepIndex(nextStepIndex)
              return intervention.steps[nextStepIndex].duration
            }

            setIsComplete(true)
            setIsPlaying(false)
            return 0
          }

          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, timeRemaining, currentStepIndex, intervention])

  useEffect(() => {
    if (!intervention || !isComplete || sessionLogged) {
      return
    }

    const persistSession = async () => {
      try {
        await saveInterventionSession({
          interventionId: intervention.id,
          completedAt: Date.now(),
          duration: intervention.totalDuration,
        })
        setSessionLogged(true)
        toast({
          title: "Practice saved",
          description: "We'll fold this session into your insights and recommendations.",
          duration: 4000,
        })
      } catch (error) {
        console.error("Failed to log intervention session", error)
        toast({
          title: "Unable to save",
          description: "We couldn't log this session. You can retry by refreshing.",
          variant: "destructive",
        })
      }
    }

    void persistSession()
  }, [intervention, isComplete, sessionLogged, toast])

  const handlePlayPause = () => {
    setIsPlaying((previous) => !previous)
  }

  const handleReset = () => {
    if (!intervention) return
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setTimeRemaining(intervention.steps[0]?.duration ?? 0)
    setIsComplete(false)
    setSessionLogged(false)
  }

  const currentStep = intervention?.steps[currentStepIndex]
  const nextStep = intervention?.steps[currentStepIndex + 1]

  const totalProgress = useMemo(() => {
    if (!intervention || !currentStep) return 0
    const stepDuration = Math.max(currentStep.duration, 1)
    const stepProgress = Math.min(1, (stepDuration - timeRemaining) / stepDuration)
    return ((currentStepIndex + stepProgress) / intervention.steps.length) * 100
  }, [intervention, currentStep, currentStepIndex, timeRemaining])

  if (!intervention) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 font-serif text-2xl font-bold">Intervention Not Found</h1>
            <Link href="/interventions">
              <Button>Back to Interventions</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const palette = getInterventionPalette(intervention.guna)

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="font-serif text-2xl">Practice Complete!</CardTitle>
                <CardDescription>
                  You've completed the {intervention.title} practice ({formatDurationLabel(intervention.totalDuration)})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Take a moment to notice how you feel. We'll use this session to refine your insights and future guidance.
                </p>
                {sessionLogged ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Logged to insights
                  </Badge>
                ) : (
                  <p className="text-xs text-muted-foreground">Saving locally…</p>
                )}
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={handleReset} variant="outline">
                    Practice Again
                  </Button>
                  <Link href="/interventions">
                    <Button>Explore More</Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="secondary">Chat with Aaranya</Button>
                  </Link>
                  <Link href="/insights">
                    <Button variant="ghost">View Insights</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex flex-col items-start gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/interventions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl font-bold sm:text-2xl">{intervention.title}</h1>
                <Badge variant="outline" className={`${palette.surface} ${palette.text} capitalize`}
                >
                  {intervention.guna}
                </Badge>
              </div>
              <p className="max-w-xl text-sm text-muted-foreground">{intervention.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDurationLabel(intervention.totalDuration)}</span>
                <span>• {intervention.type}</span>
                <span>• {intervention.difficulty}</span>
              </div>
            </div>
          </div>

          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">Progress</span>
                <Badge variant="secondary">
                  Step {currentStepIndex + 1} of {intervention.steps.length}
                </Badge>
              </div>
              <Progress value={totalProgress} className="mb-4 h-2" />
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>Time remaining: {formatTime(timeRemaining)}</span>
                <span>{Math.round(totalProgress)}% complete</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant={stepBadgeVariant(currentStep?.type ?? "instruction")} className="capitalize">
                  {currentStep?.type ?? "instruction"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <VisualDisplay intervention={intervention} isPlaying={isPlaying} currentStep={currentStep} />
              <p className="text-lg leading-relaxed">{currentStep?.instruction}</p>
              {nextStep && (
                <div className="rounded-xl border border-dashed border-border/60 bg-card/60 p-4 text-sm">
                  <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">Next</div>
                  <div className="text-sm font-medium capitalize">
                    {nextStep.type} • {formatDurationLabel(nextStep.duration)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {nextStep.instruction.length > 160
                      ? `${nextStep.instruction.slice(0, 157)}...`
                      : nextStep.instruction}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button onClick={handlePlayPause} size="lg" className="w-full px-6 sm:w-auto sm:px-8">
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  {currentStepIndex === 0 && timeRemaining === (intervention.steps[0]?.duration ?? 0)
                    ? "Start"
                    : "Resume"}
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
