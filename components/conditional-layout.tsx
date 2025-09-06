'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SeedProvider } from './seed-provider'
import { ThemeApplier } from './theme-applier'
import { ChatBotProvider, ChatBot } from './chatbot'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Don't render anything during SSR
  if (!isClient) {
    return <>{children}</>
  }
  
  // Check if this is an auth page
  const isAuthPage = pathname?.startsWith('/auth/') || pathname === '/join'
  
  if (isAuthPage) {
    // Auth pages get minimal rendering - no theme manipulation, no chatbot
    return (
      <SeedProvider>
        {children}
      </SeedProvider>
    )
  }
  
  // Non-auth pages get full functionality
  return (
    <>
      <ThemeApplier />
      <ChatBotProvider>
        <SeedProvider>
          {children}
        </SeedProvider>
        <ChatBot />
      </ChatBotProvider>
    </>
  )
}
