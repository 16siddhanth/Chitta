import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ChittaHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Lotus symbol placeholder */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 text-primary">🪷</div>
              </div>
              <div>
                <h1 className="font-serif font-black text-2xl text-foreground">Chitta</h1>
                <p className="text-sm text-muted-foreground">Vedic Mental Wellbeing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/privacy">
                <Button variant="ghost" size="sm">
                  Privacy
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="font-serif font-black text-4xl md:text-5xl text-foreground mb-4">
            Welcome to Your Inner Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover emotional balance through ancient Vedic wisdom and modern technology. Track your mental state,
            receive personalized guidance, and find inner peace.
          </p>
        </section>

        {/* Core Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Emotional Mapping */}
          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <div className="w-6 h-6 text-primary">🧘</div>
              </div>
              <CardTitle className="font-serif font-bold">Emotional Mapping</CardTitle>
              <CardDescription>
                Track your emotional state through the lens of Vedic Gunas: Sattva, Rajas, and Tamas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/emotional-mapping">
                <Button className="w-full" variant="default">
                  Begin Daily Check-in
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Companion */}
          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                <div className="w-6 h-6 text-secondary">🎧</div>
              </div>
              <CardTitle className="font-serif font-bold">Aaranya Companion</CardTitle>
              <CardDescription>
                Chat with your compassionate AI guide for personalized support and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button className="w-full" variant="secondary">
                  Start Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Micro-Interventions */}
          <Card className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <div className="w-6 h-6 text-accent">💫</div>
              </div>
              <CardTitle className="font-serif font-bold">Micro-Interventions</CardTitle>
              <CardDescription>
                Quick 3-7 minute guided practices tailored to your current emotional state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/interventions">
                <Button className="w-full bg-transparent" variant="outline">
                  Explore Practices
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Current State Preview */}
        <section className="bg-card rounded-lg p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-xl">Today's Reflection</h3>
            <Badge variant="secondary">Not Started</Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Begin your daily journey of self-awareness. Take a moment to reflect on your current emotional state.
          </p>
          <div className="flex gap-3">
            <Link href="/emotional-mapping">
              <Button size="sm">Quick Check-in</Button>
            </Link>
            <Link href="/insights">
              <Button size="sm" variant="outline">
                View Insights
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Your data is private and encrypted locally</p>
            <p>Built with ancient wisdom, modern care</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
