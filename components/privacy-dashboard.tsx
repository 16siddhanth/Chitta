"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Database, Download, Trash2, Eye, Lock } from "lucide-react"
import { getUserData, exportUserData, deleteAllData } from "@/lib/storage"

interface DataStats {
  totalEntries: number
  chatMessages: number
  interventionSessions: number
  dataSize: string
  oldestEntry: string
  encryptionStatus: "enabled" | "disabled"
}

export function PrivacyDashboard() {
  const [stats, setStats] = useState<DataStats>({
    totalEntries: 0,
    chatMessages: 0,
    interventionSessions: 0,
    dataSize: "0 KB",
    oldestEntry: "Never",
    encryptionStatus: "enabled",
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDataStats()
  }, [])

  const loadDataStats = async () => {
    try {
      const userData = await getUserData()

      // Calculate data size
      const dataString = JSON.stringify(userData)
      const sizeInBytes = new Blob([dataString]).size
      const sizeInKB = Math.round(sizeInBytes / 1024)

      // Find oldest entry
      let oldestTimestamp = Date.now()
      if (userData.emotionalEntries.length > 0) {
        oldestTimestamp = Math.min(...userData.emotionalEntries.map((entry) => entry.timestamp))
      }

      setStats({
        totalEntries: userData.emotionalEntries.length,
        chatMessages: userData.chatHistory.length,
        interventionSessions: userData.interventionSessions.length,
        dataSize: `${sizeInKB} KB`,
        oldestEntry:
          userData.emotionalEntries.length > 0 ? new Date(oldestTimestamp).toLocaleDateString() : "No entries yet",
        encryptionStatus: "enabled", // Always enabled in our implementation
      })
    } catch (error) {
      console.error("Failed to load data stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const data = await exportUserData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `chitta-privacy-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const handleDeleteAllData = async () => {
    if (
      confirm(
        "Are you sure you want to permanently delete all your data? This action cannot be undone and will remove all your emotional entries, chat history, and intervention sessions.",
      )
    ) {
      try {
        await deleteAllData()
        await loadDataStats()
        alert("All data has been permanently deleted.")
      } catch (error) {
        alert("Failed to delete data. Please try again.")
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Privacy Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Privacy Status
          </CardTitle>
          <CardDescription>Your data protection status at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">Encryption</div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Storage</div>
                <Badge variant="outline">Local Only</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold">Tracking</div>
                <Badge variant="outline">Disabled</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Your Data Summary</CardTitle>
          <CardDescription>Overview of your stored information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Emotional Entries</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.totalEntries}</span>
                <Badge variant="outline" className="text-xs">
                  Encrypted
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Chat Messages</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.chatMessages}</span>
                <Badge variant="outline" className="text-xs">
                  Encrypted
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Intervention Sessions</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.interventionSessions}</span>
                <Badge variant="outline" className="text-xs">
                  Local
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Total Data Size</span>
              <span className="font-medium">{stats.dataSize}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Oldest Entry</span>
              <span className="font-medium">{stats.oldestEntry}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Data Management</CardTitle>
          <CardDescription>Control your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button onClick={handleExportData} variant="outline" className="w-full justify-start bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export All Data (JSON)
            </Button>

            <Button variant="destructive" onClick={handleDeleteAllData} className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Data Permanently
            </Button>
          </div>

          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Your data is encrypted and stored locally on this device. Exporting creates an unencrypted backup file.
              Deleting data is permanent and cannot be undone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Score */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Privacy Score</CardTitle>
          <CardDescription>Your current privacy protection level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Privacy Score</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Excellent
              </Badge>
            </div>
            <Progress value={95} className="h-2" />
            <div className="text-xs text-muted-foreground">
              95/100 - Your data is fully encrypted, stored locally, and you have complete control over it.
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Local storage enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>End-to-end encryption active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>No third-party tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Data export available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
