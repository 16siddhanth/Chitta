"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { classifyModeration, generateChatInsights } from "@/lib/chat-memory"
import type { ChatContext } from "@/lib/chat-context"
import { getUserData, saveChatInsights, saveChatMessage, updateContextConsent } from "@/lib/storage"
import type { ChatInsights, EmotionalEntry } from "@/lib/storage"
import { Send, Sparkles } from "lucide-react"

type ConversationMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const DEFAULT_WELCOME =
  "Namaste, dear soul. I am Aaranya, your compassionate companion on this journey of self-discovery. I'm here to listen, understand, and gently guide you toward inner balance. How are you feeling in this moment?"

const DEFAULT_PROMPTS = [
  "I'm feeling overwhelmed today",
  "Help me understand my emotions",
  "I need guidance for inner peace",
  "What practices can help me right now?",
]

const typingIndicator = (
  <div className="flex space-x-1">
    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
  </div>
)

const createMessageId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

interface ChatInterfaceProps {
  initialMessage?: string
  context?: ChatContext
  suggestedPrompts?: string[]
}

export function ChatInterface({ initialMessage, context, suggestedPrompts }: ChatInterfaceProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [hasContextConsent, setHasContextConsent] = useState(false)
  const [allowTransient, setAllowTransient] = useState(false)
  const [insights, setInsights] = useState<ChatInsights | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<ConversationMessage[]>([])
  const entriesRef = useRef<EmotionalEntry[]>([])

  const welcomeMessage = useMemo(() => (initialMessage?.trim()?.length ? initialMessage : DEFAULT_WELCOME), [initialMessage])
  const prompts = useMemo(
    () => (suggestedPrompts && suggestedPrompts.length > 0 ? suggestedPrompts : DEFAULT_PROMPTS),
    [suggestedPrompts],
  )

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    let active = true

    const loadHistory = async () => {
      try {
        const data = await getUserData()
        if (!active) return

  setHasContextConsent(data.preferences.contextConsent)
        entriesRef.current = data.emotionalEntries

        const history = data.chatHistory.slice(-40).map<ConversationMessage>((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: new Date(message.timestamp),
        }))

        if (history.length > 0) {
          setMessages(history)
          messagesRef.current = history
        } else {
          const welcome = {
            id: createMessageId(),
            role: "assistant" as const,
            content: welcomeMessage,
            timestamp: new Date(),
          }
          setMessages([welcome])
          messagesRef.current = [welcome]
          if (data.preferences.contextConsent) {
            await saveChatMessage({ role: welcome.role, content: welcome.content, timestamp: welcome.timestamp.getTime() })
          }
        }

        if (data.preferences.contextConsent && data.chatInsights) {
          setInsights(data.chatInsights)
        } else {
          const generated = generateChatInsights(
            messagesRef.current.map((message) => ({
              id: message.id,
              role: message.role,
              content: message.content,
              timestamp: message.timestamp.getTime(),
            })),
            data.emotionalEntries,
          )
          setInsights(generated)
        }
      } catch (error) {
        console.error("Failed to load chat history", error)
        const fallback = {
          id: createMessageId(),
          role: "assistant" as const,
          content: welcomeMessage,
          timestamp: new Date(),
        }
        setMessages([fallback])
        messagesRef.current = [fallback]
        const fallbackInsights = generateChatInsights(
          [
            {
              id: fallback.id,
              role: fallback.role,
              content: fallback.content,
              timestamp: fallback.timestamp.getTime(),
            },
          ],
          entriesRef.current,
        )
        setInsights(fallbackInsights)
      } finally {
        if (active) {
          setIsLoadingHistory(false)
        }
      }
    }

    void loadHistory()

    return () => {
      active = false
    }
  }, [welcomeMessage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const updateInsights = useCallback(
    async (history: ConversationMessage[]) => {
      try {
        const calculated = generateChatInsights(
          history.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp.getTime(),
          })),
          entriesRef.current,
        )

        setInsights(calculated)

        if (hasContextConsent) {
          await saveChatInsights(calculated)
        }
      } catch (error) {
        console.error("Failed to update chat insights", error)
      }
    },
    [hasContextConsent],
  )

  const sendMessage = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || isSending) return

    const userMessage: ConversationMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }

    const nextHistory = [...messagesRef.current, userMessage]
    setMessages(nextHistory)
    messagesRef.current = nextHistory
    setInputValue("")
    setIsSending(true)

    try {
      if (hasContextConsent) {
        await saveChatMessage({ role: "user", content: trimmed, timestamp: userMessage.timestamp.getTime() })
      }
    } catch (error) {
      console.error("Failed to persist user message", error)
    }

    void updateInsights(nextHistory)

    const moderation = classifyModeration(trimmed)
    if (moderation.severity === "crisis") {
      const crisisReply =
        "I hear the depth of what you're feeling, dear soul. In urgent moments like these, please reach out to local emergency services, a trusted person nearby, or a crisis hotline (for example, 988 in the US / Canada, 0800 689 5652 in the UK, or your regional lifeline). You don't have to carry this alone, and immediate support is available right now."

      const assistantMessage: ConversationMessage = {
        id: createMessageId(),
        role: "assistant",
        content: crisisReply,
        timestamp: new Date(),
      }

      const updatedHistory = [...nextHistory, assistantMessage]
      setMessages(updatedHistory)
      messagesRef.current = updatedHistory

      if (hasContextConsent) {
        try {
          await saveChatMessage({
            role: "assistant",
            content: crisisReply,
            timestamp: assistantMessage.timestamp.getTime(),
          })
        } catch (error) {
          console.error("Failed to persist crisis response", error)
        }
      }

      void updateInsights(updatedHistory)

      toast({
        title: "Crisis resources shared",
        description: "We provided immediate support details. Consider following up with in-app interventions or human help.",
      })

      setIsSending(false)
      return
    }

    if (moderation.severity === "sensitive") {
      toast({
        title: "Holding space",
        description: "We'll keep this conversation gentle and mindful of the topics you raised.",
      })
    }

    const baseContext = context ? { ...context } : {}
    const contextPacket: ChatContext | undefined = hasContextConsent
      ? {
          ...baseContext,
          chatInsights: insights,
          consentGranted: true,
          moderationTags: moderation.tags,
        }
      : undefined

    try {
      const requestBody = {
        messages: nextHistory.slice(-20).map((message) => ({ role: message.role, content: message.content })),
        context: contextPacket,
        insights: hasContextConsent ? insights : undefined,
        moderation: moderation.severity === "safe" ? undefined : moderation,
        consentGranted: hasContextConsent,
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const responseJson = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof responseJson.error === "string" ? responseJson.error : "Failed to contact Gemini")
      }

      const assistantText = typeof responseJson.message === "string" ? responseJson.message.trim() : ""

      if (!assistantText) {
        throw new Error("Gemini returned an empty response")
      }

      const assistantMessage: ConversationMessage = {
        id: createMessageId(),
        role: "assistant",
        content: assistantText,
        timestamp: new Date(),
      }

      const updatedHistory = [...messagesRef.current, assistantMessage]
      setMessages(updatedHistory)
      messagesRef.current = updatedHistory

      try {
        if (hasContextConsent) {
          await saveChatMessage({
            role: "assistant",
            content: assistantText,
            timestamp: assistantMessage.timestamp.getTime(),
          })
        }
      } catch (error) {
        console.error("Failed to persist assistant message", error)
      }

      void updateInsights(updatedHistory)
    } catch (error) {
      console.error("Gemini chat error", error)

      const fallbackReply =
        "Apologies dear soul, I'm having trouble connecting right now. Could we try again in a moment?"

      const assistantMessage: ConversationMessage = {
        id: createMessageId(),
        role: "assistant",
        content: fallbackReply,
        timestamp: new Date(),
      }

      const updatedHistory = [...messagesRef.current, assistantMessage]
      setMessages(updatedHistory)
      messagesRef.current = updatedHistory

      toast({
        title: "Chat temporarily unavailable",
        description: "Aaranya ran into a connection issue. Please try again shortly.",
      })

      try {
        if (hasContextConsent) {
          await saveChatMessage({
            role: "assistant",
            content: fallbackReply,
            timestamp: assistantMessage.timestamp.getTime(),
          })
        }
      } catch (persistError) {
        console.error("Failed to persist fallback assistant message", persistError)
      }

      void updateInsights(updatedHistory)
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(inputValue)
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue("")
    void sendMessage(prompt)
  }

  const handleConsentAccept = async () => {
    try {
      const updated = await updateContextConsent(true)
      setHasContextConsent(true)
      setAllowTransient(false)
      entriesRef.current = updated.emotionalEntries
      toast({ title: "Context enabled", description: "Aaranya will now remember insights to better support you." })
      for (const message of messagesRef.current) {
        await saveChatMessage({ role: message.role, content: message.content, timestamp: message.timestamp.getTime() })
      }
      const recalculated = generateChatInsights(
        messagesRef.current.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp.getTime(),
        })),
        entriesRef.current,
      )
      setInsights(recalculated)
      await saveChatInsights(recalculated)
    } catch (error) {
      console.error("Failed to update context consent", error)
      toast({ title: "Unable to enable context", description: "Please try again." })
    }
  }

  const handleConsentDecline = () => {
    setAllowTransient(true)
    toast({ title: "Context disabled", description: "We'll keep this chat private to this session." })
  }

  const showConsentGate = !isLoadingHistory && !hasContextConsent && !allowTransient

  return (
    <Card className="group flex flex-col h-[600px] rounded-3xl border border-border/60 bg-card/95 shadow-[0_40px_120px_-80px_rgba(15,23,42,0.55)] transition-shadow duration-500 backdrop-blur-md hover:shadow-[0_52px_200px_-110px_rgba(161,98,7,0.55)]">
      {showConsentGate ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div>
            <h3 className="font-serif text-lg tracking-tight">Share context with Aaranya?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Allowing context lets Aaranya remember recent conversations and emotional check-ins to offer more tailored
              guidance. Without consent, chats stay in this session only.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleConsentAccept} className="transition-transform duration-300 hover:-translate-y-0.5">
              Allow contextual memory
            </Button>
            <Button
              variant="outline"
              onClick={handleConsentDecline}
              className="transition-transform duration-300 hover:-translate-y-0.5"
            >
              Continue without saving
            </Button>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            You can revisit this choice later in settings. Stored reflections stay encrypted on your device.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-t-3xl border-b border-border/60 bg-card/85 p-5 backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
              <Sparkles className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <h3 className="font-serif font-semibold">Aaranya</h3>
              <p className="text-xs text-muted-foreground">Your AI Companion</p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs shadow-sm">
                Online
              </Badge>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-card/40 via-transparent to-transparent p-6">
            {isLoadingHistory ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground animate-pulse">
                Gathering your recent reflections...
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} fade-in-up transition-transform`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    } shadow-sm transition-transform duration-300 ease-out will-change-transform hover:-translate-y-0.5`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div
                      className={`mt-2 text-[10px] uppercase tracking-wide ${
                        message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground/70"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isSending && !isLoadingHistory && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-border/60 bg-card/85 p-3 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center space-x-2">
                    {typingIndicator}
                    <span className="text-xs text-muted-foreground">Aaranya is reflecting...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {prompts.length > 0 && messages.length <= 1 && !isLoadingHistory && (
            <div className="px-6 pb-3">
              <p className="mb-2 text-xs text-muted-foreground">Try asking Aaranya:</p>
              <div className="flex flex-wrap gap-2.5">
                {prompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary/15"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rounded-b-3xl border-t border-border/60 bg-card/85 p-5 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Share what's on your heart..."
                className="flex-1 transition-shadow duration-300 focus-visible:shadow-[0_0_0_2px_rgba(99,102,241,0.15)]"
                disabled={isSending || isLoadingHistory}
              />
              <Button
                type="submit"
                disabled={isSending || isLoadingHistory || !inputValue.trim()}
                size="icon"
                className="transition-transform duration-300 hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  )
}
