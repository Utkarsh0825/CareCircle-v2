'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ChatBotContextType {
  isEnabled: boolean
  toggleChatBot: () => void
  setChatBotEnabled: (enabled: boolean) => void
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined)

export function useChatBot() {
  const context = useContext(ChatBotContext)
  if (context === undefined) {
    throw new Error('useChatBot must be used within a ChatBotProvider')
  }
  return context
}

interface ChatBotProviderProps {
  children: ReactNode
}

export function ChatBotProvider({ children }: ChatBotProviderProps) {
  const [isEnabled, setIsEnabled] = useState(true)

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('carecircle-chatbot-enabled')
    if (savedState !== null) {
      setIsEnabled(JSON.parse(savedState))
    }
  }, [])

  const toggleChatBot = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    localStorage.setItem('carecircle-chatbot-enabled', JSON.stringify(newState))
  }

  const setChatBotEnabled = (enabled: boolean) => {
    setIsEnabled(enabled)
    localStorage.setItem('carecircle-chatbot-enabled', JSON.stringify(enabled))
  }

  return (
    <ChatBotContext.Provider value={{
      isEnabled,
      toggleChatBot,
      setChatBotEnabled
    }}>
      {children}
    </ChatBotContext.Provider>
  )
}
