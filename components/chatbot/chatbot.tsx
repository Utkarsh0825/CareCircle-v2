'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send, Bot, User, AlertTriangle, Navigation, Calendar, Users, Settings, Heart, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatBot } from './chatbot-provider'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickActions?: QuickAction[]
  relevantFeatures?: RelevantFeature[]
}

interface QuickAction {
  type: 'navigate' | 'action' | 'info'
  target: string
  label: string
  description: string
}

interface RelevantFeature {
  name: string
  description: string
  path: string
  category: string
}

interface ChatBotProps {
  className?: string
}

export function ChatBot({ className }: ChatBotProps) {
  const { isEnabled } = useChatBot()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm CareBot, your AI care companion. I'm here to help you navigate your care journey, organize tasks, and provide support. I can help you with everything in the CareCircle app - from managing your calendar to changing themes! How can I help you today?",
      timestamp: new Date(),
      quickActions: [
        { type: 'navigate', target: '/dashboard/calendar', label: 'Open Calendar', description: 'View and manage your appointments' },
        { type: 'navigate', target: '/dashboard/updates', label: 'Share Update', description: 'Let your circle know how you\'re doing' },
        { type: 'navigate', target: '/dashboard/members', label: 'Manage Superstars', description: 'View and manage your support circle' },
        { type: 'navigate', target: '/dashboard/settings', label: 'Open Settings', description: 'Customize your app experience' },
        { type: 'navigate', target: '/donate', label: 'Send Gift', description: 'Support your care circle' }
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest('.overflow-y-auto')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    // Only scroll to bottom when new messages are added, not on initial load
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  useEffect(() => {
    // Don't auto-focus the input to prevent auto-scrolling
    // User can click on input when they want to type
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          currentPath: pathname
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        quickActions: data.quickActions || [],
        relevantFeatures: data.relevantFeatures || []
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('ChatBot error:', error)
      let errorContent = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      
      // Try to get more specific error message
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorContent = errorData.error
        }
      } catch (e) {
        // If we can't parse the error, use default message
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleQuickAction = (action: QuickAction) => {
    if (action.type === 'navigate') {
      router.push(action.target)
      setIsOpen(false) // Close chat after navigation
    } else if (action.type === 'action') {
      if (action.target === 'theme-toggle') {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
      // Add more action handlers as needed
    }
  }

  const getActionIcon = (action: QuickAction) => {
    switch (action.target) {
      case '/dashboard/calendar':
      case '/dashboard/calendar/new':
        return <Calendar className="h-4 w-4" />
      case '/dashboard/members':
        return <Users className="h-4 w-4" />
      case '/dashboard/settings':
        return <Settings className="h-4 w-4" />
      case '/dashboard/updates':
        return <MessageCircle className="h-4 w-4" />
      case '/donate':
        return <DollarSign className="h-4 w-4" />
      case '/dashboard':
        return <Navigation className="h-4 w-4" />
      case 'theme-toggle':
        return <Settings className="h-4 w-4" />
      default:
        return <Navigation className="h-4 w-4" />
    }
  }

  // Don't render anything if chatbot is disabled
  if (!isEnabled) {
    return null
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="h-16 w-16 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          size="lg"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <Card className="w-96 h-[520px] shadow-2xl border-0 bg-background/95 backdrop-blur-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-primary">CareBot</CardTitle>
                  <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">AI Care Assistant</Badge>
                  <div className="text-xs font-bold text-primary">
                    ⚠️ Always consult healthcare professionals for medical advice
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full relative">
            {/* Messages Area - Fixed height with proper scrolling */}
            <div className="absolute top-0 left-0 right-0 bottom-20 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    
                    <div className="max-w-[85%] space-y-3">
                      <div
                        className={cn(
                          "rounded-lg px-4 py-3 text-sm leading-relaxed",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted text-foreground shadow-sm'
                        )}
                      >
                        {message.content}
                      </div>
                      
                      {/* Quick Actions for Assistant Messages */}
                      {message.role === 'assistant' && message.quickActions && message.quickActions.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Quick Actions:</div>
                          <div className="flex flex-wrap gap-2">
                            {message.quickActions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAction(action)}
                                className="h-8 text-xs px-3 py-1 bg-background hover:bg-primary/10 border-primary/20"
                              >
                                {getActionIcon(action)}
                                <span className="ml-1">{action.label}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
                {/* Add bottom padding so last message isn't hidden behind input */}
                <div className="h-6"></div>
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-primary/20 bg-background">
              {/* Quick Action Buttons */}
              <div className="mb-3">
                <div className="text-xs text-muted-foreground font-medium mb-2">Quick Actions:</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction({ type: 'navigate', target: '/dashboard/calendar', label: 'Calendar', description: 'Open calendar' })}
                    className="h-7 text-xs px-2 py-1"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Calendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction({ type: 'navigate', target: '/dashboard/updates', label: 'Updates', description: 'Share update' })}
                    className="h-7 text-xs px-2 py-1"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Updates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction({ type: 'navigate', target: '/dashboard/members', label: 'Superstars', description: 'Manage circle' })}
                    className="h-7 text-xs px-2 py-1"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Superstars
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction({ type: 'navigate', target: '/dashboard/settings', label: 'Settings', description: 'Open settings' })}
                    className="h-7 text-xs px-2 py-1"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction({ type: 'action', target: 'theme-toggle', label: 'Toggle Theme', description: 'Switch dark/light mode' })}
                    className="h-7 text-xs px-2 py-1"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about CareCircle..."
                  className="flex-1 h-12 text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="default"
                  className="h-12 px-4 bg-primary hover:bg-primary/90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>




          </CardContent>
        </Card>
      )}
    </div>
  )
}
