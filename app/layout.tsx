import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { OfflineBanner } from "@/components/offline-banner"
import { InstallPrompt } from "@/components/install-prompt"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"], // Including Black weight for headings
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Chitta - Vedic Mental Wellbeing",
  description: "A Vedic-inspired mental wellness platform for emotional balance and inner peace",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chitta",
  },
}

export const viewport: Viewport = {
  themeColor: "#a16207",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/lotus-icon-vedic.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chitta" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Injected NODE_ENV at build time so this runs only in production builds.
                var ENV = ${JSON.stringify(process.env.NODE_ENV)};
                if (ENV === 'production' && 'serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                } else {
                  // Avoid registering the service worker in development to prevent cached _next chunks
                  // from causing ChunkLoadError while developing (HMR / frequent chunk changes).
                  console.log('ServiceWorker registration skipped in', ENV);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans bg-background text-foreground min-h-screen">
        <OfflineBanner />
        <InstallPrompt />
        {children}
      </body>
    </html>
  )
}
