'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Send, 
  Users,
  Heart
} from 'lucide-react'
import { 
  getRoot, 
  addChatMessage, 
  getChatMessages, 
  addSystemMessage,
  type ChatMessage 
} from '@/lib/localStore'
import { getSession } from '@/lib/session'
import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns'

interface GroupChatProps {
  groupId: string
}

export function GroupChat({ groupId }: GroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [memberCount, setMemberCount] = useState(0)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const session = getSession()

  const scrollToBottom = () => {
    if (messagesContainerRef.current && shouldAutoScroll) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
      setShouldAutoScroll(isNearBottom)
    }
  }

  const loadMessages = () => {
    const chatMessages = getChatMessages(groupId)
    setMessages(chatMessages)
    
    // Get member count
    const root = getRoot()
    const activeMembers = root.members.filter(m => m.groupId === groupId && m.status === 'ACTIVE')
    setMemberCount(activeMembers.length)
  }

  useEffect(() => {
    loadMessages()
  }, [groupId])

  useEffect(() => {
    // Only scroll to bottom on initial load
    if (messages.length > 0 && shouldAutoScroll) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [messages.length, shouldAutoScroll])

  // Auto-refresh messages every 2 seconds to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages()
    }, 2000)

    return () => clearInterval(interval)
  }, [groupId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !session.user || isLoading) {
      return
    }

    setIsLoading(true)
    
    try {
      addChatMessage({
        groupId,
        userId: session.user.id,
        message: newMessage.trim(),
        type: 'text'
      })

      setNewMessage('')
      loadMessages()
      // Always scroll to bottom when user sends a message
      setShouldAutoScroll(true)
      setTimeout(() => scrollToBottom(), 100)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatMessageTime = (createdAt: string) => {
    const date = parseISO(createdAt)
    
    if (isToday(date)) {
      return format(date, 'h:mm a')
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, h:mm a')
    }
  }

  const getUserInfo = (userId: string) => {
    if (userId === 'system') {
      return { name: 'System', initials: '🤖', isSystem: true }
    }
    
    const root = getRoot()
    const user = root.users[userId]
    
    if (!user) {
      return { name: 'Unknown User', initials: '?', isSystem: false }
    }

    const initials = user.name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()
    return { 
      name: user.name || user.email, 
      initials, 
      isSystem: false,
      isCurrentUser: userId === session.user?.id
    }
  }

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {}
    
    messages.forEach(message => {
      const date = parseISO(message.createdAt)
      let dateKey: string
      
      if (isToday(date)) {
        dateKey = 'Today'
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday'
      } else {
        dateKey = format(date, 'EEEE, MMMM d')
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })
    
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  if (!session.user) {
    return <div>Loading...</div>
  }

  return (
    <Card className="border-border/50 h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Group Chat
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {memberCount} members in this circle
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {Object.keys(messageGroups).length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-2">No messages yet</div>
              <div className="text-sm text-muted-foreground">
                Start a conversation with your care circle!
              </div>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 border-t border-border/50"></div>
                  <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border">
                    {date}
                  </div>
                  <div className="flex-1 border-t border-border/50"></div>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message) => {
                    const userInfo = getUserInfo(message.userId)
                    
                    if (message.type === 'system') {
                      return (
                        <div key={message.id} className="text-center">
                          <div className="text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1 inline-block">
                            {message.message}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div 
                        key={message.id} 
                        className={`flex gap-3 ${userInfo.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {!userInfo.isCurrentUser && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {userInfo.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`flex flex-col ${userInfo.isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          {!userInfo.isCurrentUser && (
                            <div className="text-xs text-muted-foreground mb-1">
                              {userInfo.name}
                            </div>
                          )}
                          
                          <div className={`
                            rounded-lg px-3 py-2 text-sm break-words
                            ${userInfo.isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                            }
                          `}>
                            {message.message}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatMessageTime(message.createdAt)}
                          </div>
                        </div>

                        {userInfo.isCurrentUser && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {userInfo.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border/50 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
              maxLength={500}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Updates automatically
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
