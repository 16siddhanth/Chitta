"use client"

import type React from "react"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Play, Heart, Wind, Sparkles, MoveRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  INTERVENTIONS,
  formatDurationLabel,
  getInterventionPalette,
  type InterventionType,
  type InterventionDefinition,
} from "@/lib/interventions"

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

  const iconByType = useMemo<Record<InterventionType, React.ReactNode>>(
    () => ({
      breathing: <Wind className="h-5 w-5" />,
      meditation: <Sparkles className="h-5 w-5" />,
      journaling: <Heart className="h-5 w-5" />,
      movement: <MoveRight className="h-5 w-5" />,
    }),
    [],
  )

  const filteredInterventions = useMemo(() => {
    return INTERVENTIONS.filter((intervention) => {
      const gunaMatch = selectedGuna === "all" || intervention.guna === selectedGuna
      const typeMatch = selectedType === "all" || intervention.type === selectedType
      return gunaMatch && typeMatch
    })
  }, [selectedGuna, selectedType])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl">Micro-Interventions</h1>
              <p className="text-sm text-muted-foreground">Quick practices for emotional balance</p>
            </div>
          </div>

          {/* Guna Filter Tabs */}
          <div className="mb-6 sm:mb-8">
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
            {filteredInterventions.map((intervention: InterventionDefinition) => {
              const palette = getInterventionPalette(intervention.guna)
              return (
                <Card key={intervention.id} className="border-border/50 transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
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
                          {iconByType[intervention.type]}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={`${palette.surface} ${palette.text}`}>
                          {intervention.guna}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="font-serif text-lg font-bold">{intervention.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{intervention.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDurationLabel(intervention.totalDuration)}
                      </div>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {intervention.difficulty}
                      </Badge>
                    </div>
                    <Link href={`/interventions/${intervention.id}`}>
                      <Button className="w-full" variant="default">
                        <Play className="mr-2 h-4 w-4" />
                        Start Practice
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
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
