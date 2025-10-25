"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Play, Heart, Wind, Sparkles } from "lucide-react"
import Link from "next/link"

interface Intervention {
  id: string
  title: string
  description: string
  duration: string
  guna: "sattva" | "rajas" | "tamas"
  type: "breathing" | "meditation" | "journaling" | "movement"
  difficulty: "beginner" | "intermediate" | "advanced"
  icon: React.ReactNode
}

const interventions: Intervention[] = [
  // Sattva Interventions (Clarity & Peace)
  {
    id: "gratitude-reflection",
    title: "Gratitude Reflection",
    description: "Cultivate appreciation and positive awareness through guided gratitude practice",
    duration: "5 min",
    guna: "sattva",
    type: "journaling",
    difficulty: "beginner",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: "mindful-awareness",
    title: "Mindful Awareness",
    description: "Deepen your present moment awareness with gentle mindfulness meditation",
    duration: "7 min",
    guna: "sattva",
    type: "meditation",
    difficulty: "beginner",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "vision-clarity",
    title: "Vision Clarity",
    description: "Connect with your deeper purpose and aspirations through guided visualization",
    duration: "6 min",
    guna: "sattva",
    type: "meditation",
    difficulty: "intermediate",
    icon: <Sparkles className="w-5 h-5" />,
  },

  // Rajas Interventions (Activity & Restlessness)
  {
    id: "alternate-nostril",
    title: "Alternate Nostril Breathing",
    description: "Balance your nervous system with this traditional pranayama technique",
    duration: "4 min",
    guna: "rajas",
    type: "breathing",
    difficulty: "intermediate",
    icon: <Wind className="w-5 h-5" />,
  },
  {
    id: "calming-breath",
    title: "4-7-8 Calming Breath",
    description: "Activate your relaxation response with this powerful breathing pattern",
    duration: "3 min",
    guna: "rajas",
    type: "breathing",
    difficulty: "beginner",
    icon: <Wind className="w-5 h-5" />,
  },
  {
    id: "focus-mantra",
    title: "Focus Mantra Meditation",
    description: "Channel restless energy into concentrated awareness with sacred sounds",
    duration: "5 min",
    guna: "rajas",
    type: "meditation",
    difficulty: "beginner",
    icon: <Sparkles className="w-5 h-5" />,
  },

  // Tamas Interventions (Inertia & Heaviness)
  {
    id: "energizing-breath",
    title: "Energizing Breath Work",
    description: "Awaken your vital energy with invigorating breathing techniques",
    duration: "4 min",
    guna: "tamas",
    type: "breathing",
    difficulty: "beginner",
    icon: <Wind className="w-5 h-5" />,
  },
  {
    id: "body-scan-activation",
    title: "Body Scan Activation",
    description: "Gently awaken your body's energy centers through mindful scanning",
    duration: "6 min",
    guna: "tamas",
    type: "meditation",
    difficulty: "beginner",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: "gentle-movement",
    title: "Gentle Movement Flow",
    description: "Light, mindful movements to shift stagnant energy and increase vitality",
    duration: "7 min",
    guna: "tamas",
    type: "movement",
    difficulty: "beginner",
    icon: <Heart className="w-5 h-5" />,
  },
]

const gunaColors = {
  sattva: "bg-secondary/10 text-secondary border-secondary/20",
  rajas: "bg-primary/10 text-primary border-primary/20",
  tamas: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
}

const gunaDescriptions = {
  sattva: "Practices to maintain and deepen clarity, peace, and harmony",
  rajas: "Techniques to calm restlessness and channel active energy",
  tamas: "Methods to lift heaviness and awaken vital energy",
}

export default function InterventionsPage() {
  const [selectedGuna, setSelectedGuna] = useState<"all" | "sattva" | "rajas" | "tamas">("all")
  const [selectedType, setSelectedType] = useState<"all" | "breathing" | "meditation" | "journaling" | "movement">(
    "all",
  )

  const filteredInterventions = interventions.filter((intervention) => {
    const gunaMatch = selectedGuna === "all" || intervention.guna === selectedGuna
    const typeMatch = selectedType === "all" || intervention.type === selectedType
    return gunaMatch && typeMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-bold text-3xl">Micro-Interventions</h1>
              <p className="text-muted-foreground">Quick practices for emotional balance</p>
            </div>
          </div>

          {/* Guna Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedGuna === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGuna("all")}
              >
                All Practices
              </Button>
              <Button
                variant={selectedGuna === "sattva" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedGuna("sattva")}
              >
                Sattva (Clarity)
              </Button>
              <Button
                variant={selectedGuna === "rajas" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGuna("rajas")}
                className={selectedGuna === "rajas" ? "bg-primary" : ""}
              >
                Rajas (Activity)
              </Button>
              <Button
                variant={selectedGuna === "tamas" ? "outline" : "outline"}
                size="sm"
                onClick={() => setSelectedGuna("tamas")}
                className={selectedGuna === "tamas" ? "bg-muted text-muted-foreground" : ""}
              >
                Tamas (Rest)
              </Button>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                All Types
              </Button>
              <Button
                variant={selectedType === "breathing" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("breathing")}
              >
                Breathing
              </Button>
              <Button
                variant={selectedType === "meditation" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("meditation")}
              >
                Meditation
              </Button>
              <Button
                variant={selectedType === "journaling" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("journaling")}
              >
                Journaling
              </Button>
              <Button
                variant={selectedType === "movement" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("movement")}
              >
                Movement
              </Button>
            </div>
          </div>

          {/* Description for selected Guna */}
          {selectedGuna !== "all" && (
            <Card className="mb-8">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{gunaDescriptions[selectedGuna]}</p>
              </CardContent>
            </Card>
          )}

          {/* Interventions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterventions.map((intervention) => (
              <Card key={intervention.id} className="border-border/50 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        intervention.guna === "sattva"
                          ? "bg-secondary/10"
                          : intervention.guna === "rajas"
                            ? "bg-primary/10"
                            : "bg-muted-foreground/10"
                      }`}
                    >
                      <div
                        className={
                          intervention.guna === "sattva"
                            ? "text-secondary"
                            : intervention.guna === "rajas"
                              ? "text-primary"
                              : "text-muted-foreground"
                        }
                      >
                        {intervention.icon}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={gunaColors[intervention.guna]}>
                        {intervention.guna}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="font-serif font-bold text-lg">{intervention.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{intervention.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {intervention.duration}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {intervention.difficulty}
                    </Badge>
                  </div>
                  <Link href={`/interventions/${intervention.id}`}>
                    <Button className="w-full" variant="default">
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInterventions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No interventions found for the selected filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGuna("all")
                  setSelectedType("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
