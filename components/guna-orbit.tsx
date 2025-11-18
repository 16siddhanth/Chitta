"use client"

import { useEffect, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Flower2, Sun, Flame, Moon } from "lucide-react"

const ORBIT_RADIUS = 120

const calculateNodePosition = (index: number, total: number, rotationAngle: number) => {
  const angle = ((index / total) * 360 + rotationAngle) % 360
  const radian = (angle * Math.PI) / 180
  const x = ORBIT_RADIUS * Math.cos(radian)
  const y = ORBIT_RADIUS * Math.sin(radian)
  const zIndex = Math.round(100 + 50 * Math.cos(radian))
  const opacity = Math.max(0.55, Math.min(1, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2)))

  return { x, y, zIndex, opacity }
}

export type GunaNode = {
  id: number
  name: string
  icon: LucideIcon
  color: string
  description: string
}

const gunaNodes: GunaNode[] = [
  {
    id: 1,
    name: "Sattva",
    icon: Sun,
    color: "from-amber-200 to-amber-100",
    description: "Calm clarity, balance, and empathy",
  },
  {
    id: 2,
    name: "Rajas",
    icon: Flame,
    color: "from-amber-400 to-orange-300",
    description: "Motivation, passion, and purposeful action",
  },
  {
    id: 3,
    name: "Tamas",
    icon: Moon,
    color: "from-orange-600 to-rose-500",
    description: "Rest, reflection, and steady grounding",
  },
]

export function GunaOrbit() {
  const [selectedGuna, setSelectedGuna] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const autoRotate = useMemo(() => selectedGuna === null, [selectedGuna])

  useEffect(() => {
    if (!autoRotate) return undefined

    const rotationTimer = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.5) % 360)
    }, 50)

    return () => clearInterval(rotationTimer)
  }, [autoRotate])

  return (
    <div className="relative flex h-64 sm:h-80 items-center justify-center">
      <div className="absolute flex h-full w-full items-center justify-center">
        <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow-xl">
          <Flower2 className="h-10 w-10" />
        </div>
        <div className="absolute h-56 w-56 rounded-full border border-orange-200/40" />
        {gunaNodes.map((node, index) => {
          const position = calculateNodePosition(index, gunaNodes.length, rotationAngle)
          const Icon = node.icon
          const isSelected = selectedGuna === node.name

          return (
            <button
              key={node.id}
              type="button"
              className="absolute transition-all duration-700"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isSelected ? 200 : position.zIndex,
                opacity: isSelected ? 1 : position.opacity,
              }}
              onClick={() => setSelectedGuna((prev) => (prev === node.name ? null : node.name))}
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${node.color} shadow-lg transition-all duration-300 ${
                  isSelected ? "scale-125 shadow-2xl" : "hover:scale-110"
                }`}
              >
                <Icon className="h-7 w-7 text-white" />
              </span>
              <span className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className={`text-xs font-semibold text-slate-800 transition-all ${isSelected ? "scale-110" : ""}`}>
                  {node.name}
                </p>
                {isSelected && (
                  <p className="mt-1 text-xs text-slate-600 animate-fade-in">{node.description}</p>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
