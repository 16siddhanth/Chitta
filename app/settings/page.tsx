"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Upload, Trash2, Shield, Database, Settings, Eye } from "lucide-react"
import Link from "next/link"
import { exportUserData, importUserData, deleteAllData, getUserData } from "@/lib/storage"
import { useOffline } from "@/hooks/use-offline"
import { usePWA } from "@/hooks/use-pwa"
import { PrivacyDashboard } from "@/components/privacy-dashboard"

export default function SettingsPage() {
  const [dataSize, setDataSize] = useState<string>("0 KB")
  const [lastSync, setLastSync] = useState<string>("Never")
  const [notifications, setNotifications] = useState(true)
  const isOffline = useOffline()
  const { isInstalled, isInstallable, installApp } = usePWA()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const userData = await getUserData()
      setNotifications(userData.preferences.notifications)

      // Calculate approximate data size
      const dataString = JSON.stringify(userData)
      const sizeInBytes = new Blob([dataString]).size
      const sizeInKB = Math.round(sizeInBytes / 1024)
      setDataSize(`${sizeInKB} KB`)
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const handleExportData = async () => {
    try {
      const data = await exportUserData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `chitta-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const text = await file.text()
          await importUserData(text)
          loadSettings()
          alert("Data imported successfully!")
        } catch (error) {
          alert("Failed to import data. Please check the file format.")
        }
      }
    }
    input.click()
  }

  const handleDeleteAllData = async () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      try {
        await deleteAllData()
        setDataSize("0 KB")
        alert("All data has been deleted.")
      } catch (error) {
        alert("Failed to delete data.")
      }
    }
  }

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
              <h1 className="font-serif font-bold text-2xl">Settings</h1>
              <p className="text-muted-foreground">Manage your data and preferences</p>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Connection Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Connection & Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connection Status</span>
                      <Badge variant={isOffline ? "destructive" : "secondary"}>
                        {isOffline ? "Offline" : "Online"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Storage</span>
                      <Badge variant="outline">Local & Encrypted</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Sync</span>
                      <span className="text-sm text-muted-foreground">{lastSync}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Installation */}
              {(isInstallable || !isInstalled) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Install App</CardTitle>
                    <CardDescription>
                      Install Chitta for better offline access and native app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isInstallable ? (
                      <Button onClick={installApp} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Install Chitta
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">App installation is not available in this browser</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Notifications</div>
                        <div className="text-xs text-muted-foreground">Receive reminders for daily check-ins</div>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif font-bold text-xl">Privacy Dashboard</h2>
                  <p className="text-muted-foreground">Monitor and control your data privacy</p>
                </div>
                <Link href="/privacy">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Button>
                </Link>
              </div>
              <PrivacyDashboard />
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              {/* Data Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>Your data is stored locally and encrypted for privacy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Size</span>
                      <span className="text-sm font-medium">{dataSize}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" onClick={handleImportData}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </div>

                    <Button variant="destructive" onClick={handleDeleteAllData} className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Data
                    </Button>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Your data is encrypted using AES-256 encryption and stored locally on your device. Export
                        creates an unencrypted backup file for portability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
