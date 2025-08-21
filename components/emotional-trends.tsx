"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Mock data for demonstration
const mockTrendData = [
  { date: "Mon", sattva: 65, rajas: 45, tamas: 30 },
  { date: "Tue", sattva: 70, rajas: 40, tamas: 25 },
  { date: "Wed", sattva: 55, rajas: 60, tamas: 35 },
  { date: "Thu", sattva: 60, rajas: 55, tamas: 40 },
  { date: "Fri", sattva: 75, rajas: 35, tamas: 20 },
  { date: "Sat", sattva: 80, rajas: 30, tamas: 15 },
  { date: "Sun", sattva: 85, rajas: 25, tamas: 10 },
]

export function EmotionalTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Weekly Emotional Trends</CardTitle>
        <CardDescription>Track your Guna balance over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTrendData}>
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
        </div>
      </CardContent>
    </Card>
  )
}
