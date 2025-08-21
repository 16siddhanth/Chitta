import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Calendar, Target } from "lucide-react"
import Link from "next/link"
import { EmotionalTrends } from "@/components/emotional-trends"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-bold text-2xl">Emotional Insights</h1>
              <p className="text-muted-foreground">Your journey of self-awareness</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Trends Chart */}
            <div className="lg:col-span-2">
              <EmotionalTrends />
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Current Streak */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Check-in Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">7</div>
                    <div className="text-sm text-muted-foreground">days in a row</div>
                  </div>
                </CardContent>
              </Card>

              {/* Dominant Guna This Week */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    This Week's Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      Sattva Dominant
                    </Badge>
                    <p className="text-sm text-muted-foreground text-center">
                      You've been experiencing more clarity and peace this week
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Maintain Balance</div>
                      <div className="text-muted-foreground">Continue your current practices</div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium mb-1">Energy Management</div>
                      <div className="text-muted-foreground">Watch for mid-week energy dips</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Weekly Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Sattva Insights</CardTitle>
                <CardDescription>Clarity and Peace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Day</span>
                    <span className="text-sm font-medium">Sunday</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Trend</span>
                    <span className="text-sm font-medium text-green-600">↗ Improving</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Rajas Insights</CardTitle>
                <CardDescription>Activity and Passion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average</span>
                    <span className="text-sm font-medium">41%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Day</span>
                    <span className="text-sm font-medium">Wednesday</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Trend</span>
                    <span className="text-sm font-medium text-blue-600">→ Stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Tamas Insights</CardTitle>
                <CardDescription>Rest and Inertia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak Day</span>
                    <span className="text-sm font-medium">Thursday</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Trend</span>
                    <span className="text-sm font-medium text-green-600">↘ Decreasing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
