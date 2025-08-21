"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import { usePWA } from "@/hooks/use-pwa"
import { useState } from "react"

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isInstallable || isDismissed) return null

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <CardTitle className="font-serif text-lg">Install Chitta</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsDismissed(true)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>Install Chitta on your device for a better experience and offline access</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={installApp} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Install App
        </Button>
      </CardContent>
    </Card>
  )
}
