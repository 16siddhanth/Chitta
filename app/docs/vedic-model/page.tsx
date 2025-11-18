import fs from "node:fs"
import path from "node:path"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

const loadDocument = () => {
  try {
    const docPath = path.join(process.cwd(), "vedic-model.md")
    return fs.readFileSync(docPath, "utf8")
  } catch (error) {
    console.error("Unable to read vedic-model.md", error)
    return "vedic-model.md is missing."
  }
}

export default function VedicModelDocPage() {
  const content = loadDocument()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Link href="/insights">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Insights
                </Button>
              </Link>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Reference</p>
            </div>
            <p className="text-sm text-muted-foreground">
              The source of truth for the tri-guna computation and intervention mapping.
            </p>
          </div>

          <article className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg">
            <pre className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{content}</pre>
          </article>
        </div>
      </div>
    </div>
  )
}
