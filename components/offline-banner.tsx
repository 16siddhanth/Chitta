"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { WifiOff } from "lucide-react"
import { useOffline } from "@/hooks/use-offline"

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) return null

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800 mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>You're currently offline. Your data is saved locally and will sync when you're back online.</span>
        <Badge variant="outline" className="ml-2">
          Offline Mode
        </Badge>
      </AlertDescription>
    </Alert>
  )
}
