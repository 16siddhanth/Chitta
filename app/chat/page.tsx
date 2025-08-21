"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Namaste, dear soul. I am Aaranya, your compassionate companion on this journey of self-discovery. I'm here to listen, understand, and gently guide you toward inner balance. How are you feeling in this moment?",
    timestamp: new Date(),
  },
]

const suggestedPrompts = [
  "I'm feeling overwhelmed today",
  "Help me understand my emotions",
  "I need guidance for inner peace",
  "What practices can help me right now?",
]

export default function ChatPage() {
  const [localMessages, setLocalMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  // Simulate AI response for now (in real implementation, this would use the AI SDK)
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setLocalMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAaranyaResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setLocalMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAaranyaResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("overwhelmed") || input.includes("stressed") || input.includes("anxious")) {
      return "I sense the weight you're carrying, and I want you to know that feeling overwhelmed is a natural part of the human experience. Like a river that becomes turbulent when it encounters rocks, your mind may be experiencing the Rajas guna - restlessness and agitation.\n\nLet's bring some Sattva into this moment. Try this: Take three deep breaths with me. Inhale peace, exhale tension. Remember, this feeling is temporary, like clouds passing across the sky of your consciousness.\n\nWould you like me to guide you through a brief calming practice, or would you prefer to share more about what's weighing on your heart?"
    }

    if (input.includes("sad") || input.includes("down") || input.includes("depressed")) {
      return "I feel the heaviness in your words, dear one. What you're experiencing might be influenced by Tamas - a natural state of rest and introspection, though when it lingers, it can feel like a heavy blanket over your spirit.\n\nRemember that even the lotus grows from muddy waters to bloom in the light. Your current state is not your permanent residence. Sometimes our souls need to rest in the darkness before they can reach toward the light again.\n\nGentle movement, connection with nature, or even just acknowledging this feeling with compassion can help shift the energy. What small step toward lightness feels possible for you today?"
    }

    if (input.includes("angry") || input.includes("frustrated") || input.includes("irritated")) {
      return "I can sense the fire within you - this intensity you're feeling is the Rajas guna expressing itself through passion and energy. Anger, while uncomfortable, often carries important messages about our boundaries and values.\n\nLike a flame that can either destroy or illuminate, this energy can be transformed. In Vedic wisdom, we learn that anger is often unexpressed hurt or unmet needs seeking attention.\n\nTake a moment to breathe deeply and ask yourself: What is this anger trying to protect or communicate? Sometimes the most powerful thing we can do is simply witness our emotions without judgment.\n\nWould you like to explore what's beneath this feeling, or shall we work on some cooling practices together?"
    }

    if (input.includes("peaceful") || input.includes("calm") || input.includes("good") || input.includes("happy")) {
      return "How beautiful to hear the Sattva flowing through your being! This state of peace and clarity is your natural essence - like a still lake reflecting the sky perfectly. When we're in this space, we're aligned with our truest self.\n\nThis is a wonderful time for gratitude practice or creative expression. Your peaceful energy can be a gift not just to yourself, but to everyone around you. Like a candle that lights other candles without diminishing its own flame.\n\nHow would you like to honor and nurture this beautiful state you're in? Perhaps through meditation, journaling, or simply being present with this moment of grace?"
    }

    if (input.includes("help") || input.includes("guidance") || input.includes("what should i do")) {
      return "Your willingness to seek guidance shows great wisdom, dear soul. True strength lies not in having all the answers, but in knowing when to pause and listen - both to your inner voice and to the wisdom that surrounds you.\n\nIn this moment, I invite you to place your hand on your heart and feel its steady rhythm. This is your inner compass, always available to guide you. The answers you seek often lie not in the noise of the mind, but in the quiet wisdom of the heart.\n\nWhat specific area of your life feels most in need of clarity right now? Together, we can explore the gentle steps that align with your highest good."
    }

    // Default response
    return "Thank you for sharing with me. I'm here to listen and walk alongside you on this journey. Every emotion you experience is valid and carries its own wisdom.\n\nIn Vedic understanding, all experiences - whether challenging or joyful - are opportunities for growth and self-discovery. Like a skilled gardener tends to all plants in the garden, we can learn to tend to all aspects of our inner landscape with equal care.\n\nWhat would feel most supportive for you right now? I'm here to listen, offer gentle guidance, or simply sit in this space with you."
  }

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const [inputValue, setInputValue] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl">Aaranya</h1>
              <p className="text-muted-foreground">Your Compassionate AI Companion</p>
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex flex-col h-[600px]">
          {/* Messages */}
          <Card className="flex-1 mb-4">
            <CardContent className="p-0">
              <div className="h-full overflow-y-auto p-6 space-y-4">
                {localMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-4"
                          : "bg-card border border-border mr-4"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      <div
                        className={`text-xs mt-2 opacity-70 ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-lg p-4 mr-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">Aaranya is reflecting...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Suggested Prompts */}
          {localMessages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3">Try asking Aaranya about:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Share what's on your heart..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                  setInputValue("")
                }
              }}
              disabled={isTyping}
            />
            <Button
              onClick={() => {
                handleSendMessage(inputValue)
                setInputValue("")
              }}
              disabled={isTyping || !inputValue.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Aaranya provides supportive guidance based on Vedic wisdom. For serious mental health concerns, please
            consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  )
}
