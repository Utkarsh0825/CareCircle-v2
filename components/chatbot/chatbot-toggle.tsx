'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MessageCircle, Bot } from 'lucide-react'
import { useChatBot } from './chatbot-provider'

export function ChatBotToggle() {
  const { isEnabled, toggleChatBot } = useChatBot()

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-primary" />
        <Label htmlFor="chatbot-toggle" className="text-sm font-medium">
          CareBot Assistant
        </Label>
      </div>
      <Switch
        id="chatbot-toggle"
        checked={isEnabled}
        onCheckedChange={toggleChatBot}
      />
      <span className="text-xs text-muted-foreground">
        {isEnabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  )
}
