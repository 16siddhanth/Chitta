import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Lock, Eye, Database, Download } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
              <h1 className="font-serif font-bold text-3xl">Privacy & Security</h1>
              <p className="text-muted-foreground">Your data, your control</p>
            </div>
          </div>

          {/* Privacy Principles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Our Privacy Principles
              </CardTitle>
              <CardDescription>
                Chitta is built with privacy-first design principles, ensuring your mental health data remains secure
                and under your control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Local-First Storage</h3>
                      <p className="text-sm text-muted-foreground">
                        All your emotional data, chat history, and personal insights are stored locally on your device,
                        not on our servers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">End-to-End Encryption</h3>
                      <p className="text-sm text-muted-foreground">
                        Your data is encrypted using AES-256 encryption before being stored, ensuring only you can
                        access it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Eye className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">No Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        We don't use analytics, tracking pixels, or third-party services that could compromise your
                        privacy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Download className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Data Portability</h3>
                      <p className="text-sm text-muted-foreground">
                        Export your data anytime in standard formats. Your data belongs to you, always.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">What Data We Collect</CardTitle>
              <CardDescription>Complete transparency about the information Chitta stores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Emotional Wellness Data
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily emotional check-ins (Guna assessments)</span>
                      <Badge variant="outline">Local Only</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Personal reflections and journal entries</span>
                      <Badge variant="outline">Encrypted</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Intervention session history</span>
                      <Badge variant="outline">Local Only</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chat conversations with Aaranya</span>
                      <Badge variant="outline">Encrypted</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Technical Data</h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">App preferences and settings</span>
                      <Badge variant="outline">Local Only</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Offline sync status</span>
                      <Badge variant="outline">Device Only</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-green-600">What We DON'T Collect</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
                    <p className="text-sm text-green-800">✓ No personal identifiers (name, email, phone)</p>
                    <p className="text-sm text-green-800">✓ No location data or device fingerprinting</p>
                    <p className="text-sm text-green-800">✓ No usage analytics or behavioral tracking</p>
                    <p className="text-sm text-green-800">✓ No third-party data sharing</p>
                    <p className="text-sm text-green-800">✓ No advertising or marketing data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">Security Measures</CardTitle>
              <CardDescription>How we protect your sensitive mental health data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Encryption at Rest</h4>
                    <p className="text-sm text-muted-foreground">
                      All data is encrypted using AES-256-GCM encryption before being stored in your browser's local
                      storage.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Encryption keys are generated locally using Web Crypto API and never leave your device.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Secure Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      AI conversations use HTTPS encryption and are processed securely without storing personal context.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Data Isolation</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is isolated to your device and browser, with no cross-user data sharing or cloud
                      storage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">Your Data Rights</CardTitle>
              <CardDescription>You have complete control over your mental health data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Right to Access</h4>
                    <p className="text-sm text-muted-foreground">View all your stored data anytime</p>
                  </div>
                  <Link href="/settings">
                    <Button variant="outline" size="sm">
                      View Data
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Right to Export</h4>
                    <p className="text-sm text-muted-foreground">Download your data in JSON format</p>
                  </div>
                  <Link href="/settings">
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Right to Delete</h4>
                    <p className="text-sm text-muted-foreground">Permanently remove all your data</p>
                  </div>
                  <Link href="/settings">
                    <Button variant="outline" size="sm">
                      Manage Data
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Right to Portability</h4>
                    <p className="text-sm text-muted-foreground">Transfer your data to other platforms</p>
                  </div>
                  <Badge variant="secondary">Always Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Questions & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This privacy policy reflects our commitment to protecting your mental health data. Since Chitta
                  operates entirely on your device, you maintain complete control over your information.
                </p>

                <div className="flex items-center gap-4">
                  <Badge variant="outline">Last Updated: {new Date().toLocaleDateString()}</Badge>
                  <Badge variant="secondary">Version 1.0</Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  For questions about privacy or security, please contact us through the app settings or visit our
                  support documentation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
