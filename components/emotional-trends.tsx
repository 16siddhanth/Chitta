"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { TrendPoint } from "@/lib/emotional-model"

interface EmotionalTrendsProps {
  data: TrendPoint[]
}

export function EmotionalTrends({ data }: EmotionalTrendsProps) {
  const hasData = data.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Weekly Emotional Trends</CardTitle>
        <CardDescription>
          {hasData ? "Track your Guna balance over the past week" : "Complete a check-in to see your patterns"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sattva"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Sattva (Clarity)"
                />
                <Line
                  type="monotone"
                  dataKey="rajas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Rajas (Activity)"
                />
                <Line
                  type="monotone"
                  dataKey="tamas"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  name="Tamas (Inertia)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              No recent check-ins to display yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
