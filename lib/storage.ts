// Encrypted local storage utilities for Chitta
export interface WearableSnapshot {
  hrv?: number
  sleepQuality?: number
  activityLoad?: number
  breathRate?: number
  readinessScore?: number
  lastSync?: number
}

export interface EmotionalEntry {
  id: string
  date: string
  sattva: number
  rajas: number
  tamas: number
  balanceIndex: number
  confidence: number
  reflection: string
  dominantGuna: "sattva" | "rajas" | "tamas"
  recommendedInterventionIds: string[]
  metrics: {
    clarity: number
    peace: number
    energy: number
    restlessness: number
    activity: number
    inertia: number
  }
  wearable?: WearableSnapshot
  timestamp: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface ChatInsights {
  summary?: string
  themes?: string[]
  highlights?: string[]
  lastUpdated?: number
}

export interface InterventionSession {
  id: string
  interventionId: string
  completedAt: number
  duration: number
  rating?: number
}

export interface UserData {
  emotionalEntries: EmotionalEntry[]
  chatHistory: ChatMessage[]
  chatInsights?: ChatInsights
  interventionSessions: InterventionSession[]
  preferences: {
    theme: "light" | "dark"
    notifications: boolean
    dataRetention: number // days
    contextConsent: boolean
  }
}

// Simple encryption/decryption using Web Crypto API
class SecureStorage {
  private static instance: SecureStorage
  private key: CryptoKey | null = null
  private initializing: Promise<void> | null = null

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage()
    }
    return SecureStorage.instance
  }

  async initialize(): Promise<void> {
    if (this.key) return

    if (this.initializing) {
      return this.initializing
    }

    this.initializing = (async () => {
      try {
        const keyData = localStorage.getItem("chitta-key")
        if (keyData) {
          const keyBuffer = new Uint8Array(JSON.parse(keyData))
          this.key = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
        } else {
          this.key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
          const keyBuffer = await crypto.subtle.exportKey("raw", this.key)
          localStorage.setItem("chitta-key", JSON.stringify(Array.from(new Uint8Array(keyBuffer))))
        }
      } catch (error) {
        console.error("Failed to initialize secure storage:", error)
        // Fallback to unencrypted storage
      } finally {
        this.initializing = null
      }
    })()

    return this.initializing
  }

  private async ensureKey(): Promise<void> {
    if (!this.key) {
      await this.initialize()
    }
  }

  async encrypt(data: string): Promise<string> {
    await this.ensureKey()

    if (!this.key) {
      return data // Fallback to unencrypted
    }

    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)
      const iv = crypto.getRandomValues(new Uint8Array(12))

      const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, this.key, dataBuffer)

      const encryptedArray = new Uint8Array(encryptedBuffer)
      const result = new Uint8Array(iv.length + encryptedArray.length)
      result.set(iv)
      result.set(encryptedArray, iv.length)

      return btoa(String.fromCharCode(...result))
    } catch (error) {
      console.error("Encryption failed:", error)
      return data
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    await this.ensureKey()

    if (!this.key) {
      return encryptedData // Fallback to unencrypted
    }

    try {
      const dataBuffer = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0)),
      )

      const iv = dataBuffer.slice(0, 12)
      const encrypted = dataBuffer.slice(12)

      const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, this.key, encrypted)

      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch (error) {
      console.error("Decryption failed:", error)
      return encryptedData
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonString = JSON.stringify(value)
      const encryptedData = await this.encrypt(jsonString)
      localStorage.setItem(`chitta-${key}`, encryptedData)
    } catch (error) {
      console.error("Failed to store data:", error)
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const encryptedData = localStorage.getItem(`chitta-${key}`)
      if (!encryptedData) return null

      const decryptedData = await this.decrypt(encryptedData)
      return JSON.parse(decryptedData) as T
    } catch (error) {
      console.error("Failed to retrieve data:", error)
      return null
    }
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(`chitta-${key}`)
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("chitta-"))
    keys.forEach((key) => localStorage.removeItem(key))
  }
}

export const secureStorage = SecureStorage.getInstance()

// Data management functions
export const saveEmotionalEntry = async (entry: Omit<EmotionalEntry, "id" | "timestamp">): Promise<EmotionalEntry> => {
  const userData = await getUserData()
  const newEntry: EmotionalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }

  userData.emotionalEntries.push(newEntry)
  await secureStorage.setItem("userData", userData)

  return newEntry
}

export const saveChatMessage = async (message: Omit<ChatMessage, "id"> & { timestamp?: number }): Promise<void> => {
  const userData = await getUserData()
  if (!userData.preferences.contextConsent) {
    return
  }
  const newMessage: ChatMessage = {
    role: message.role,
    content: message.content,
    id: crypto.randomUUID(),
    timestamp: message.timestamp ?? Date.now(),
  }

  userData.chatHistory.push(newMessage)

  // Keep only last 100 messages to manage storage
  if (userData.chatHistory.length > 100) {
    userData.chatHistory = userData.chatHistory.slice(-100)
  }

  await secureStorage.setItem("userData", userData)
}

export const saveChatInsights = async (insights: ChatInsights): Promise<void> => {
  const userData = await getUserData()
  if (!userData.preferences.contextConsent) {
    return
  }

  userData.chatInsights = {
    ...insights,
    lastUpdated: Date.now(),
  }

  await secureStorage.setItem("userData", userData)
}

export const saveInterventionSession = async (session: Omit<InterventionSession, "id">): Promise<void> => {
  const userData = await getUserData()
  const newSession: InterventionSession = {
    ...session,
    id: crypto.randomUUID(),
  }

  userData.interventionSessions.push(newSession)
  await secureStorage.setItem("userData", userData)
}

export const getUserData = async (): Promise<UserData> => {
  await secureStorage.initialize()

  const userData = await secureStorage.getItem<UserData>("userData")

  if (!userData) {
    const defaultData: UserData = {
      emotionalEntries: [],
      chatHistory: [],
      chatInsights: undefined,
      interventionSessions: [],
      preferences: {
        theme: "light",
        notifications: true,
        dataRetention: 365,
        contextConsent: false,
      },
    }
    await secureStorage.setItem("userData", defaultData)
    return defaultData
  }

  if (userData.preferences.contextConsent === undefined) {
    userData.preferences.contextConsent = false
    await secureStorage.setItem("userData", userData)
  }

  return userData
}

export const updateContextConsent = async (consent: boolean): Promise<UserData> => {
  const userData = await getUserData()
  userData.preferences.contextConsent = consent

  if (!consent) {
    userData.chatHistory = []
    userData.chatInsights = undefined
  }

  await secureStorage.setItem("userData", userData)
  return userData
}

export const exportUserData = async (): Promise<string> => {
  const userData = await getUserData()
  return JSON.stringify(userData, null, 2)
}

export const importUserData = async (jsonData: string): Promise<void> => {
  try {
    const userData = JSON.parse(jsonData) as UserData
    await secureStorage.setItem("userData", userData)
  } catch (error) {
    throw new Error("Invalid data format")
  }
}

export const deleteAllData = async (): Promise<void> => {
  await secureStorage.clear()
}
