'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MaleAvatar1, MaleAvatar2, MaleAvatar3, MaleAvatar4, MaleAvatar5,
  FemaleAvatar1, FemaleAvatar2, FemaleAvatar3, FemaleAvatar4, FemaleAvatar5,
  AVATARS, type AvatarId 
} from '@/components/avatars'
import { UserAvatar } from '@/components/user-avatar'

interface AvatarSelectorProps {
  currentAvatar?: string
  onAvatarSelect: (avatarId: string) => void
  className?: string
}

const AvatarComponents = {
  'male-1': MaleAvatar1,
  'male-2': MaleAvatar2,
  'male-3': MaleAvatar3,
  'male-4': MaleAvatar4,
  'male-5': MaleAvatar5,
  'female-1': FemaleAvatar1,
  'female-2': FemaleAvatar2,
  'female-3': FemaleAvatar3,
  'female-4': FemaleAvatar4,
  'female-5': FemaleAvatar5,
}

export function AvatarSelector({ currentAvatar, onAvatarSelect, className }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(currentAvatar as AvatarId || null)
  const [isOpen, setIsOpen] = useState(false)

  const handleAvatarSelect = (avatarId: AvatarId) => {
    setSelectedAvatar(avatarId)
  }

  const handleConfirm = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar)
      setIsOpen(false)
    }
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Profile Avatar</label>
        <div className="flex items-center gap-3">
          <UserAvatar 
            avatarId={currentAvatar} 
            name="Current User"
            size="lg"
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Choose Avatar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Choose Your Avatar</DialogTitle>
                <DialogDescription>
                  Select an avatar that represents you. You can choose from male or female options.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Male Avatars */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Male</Badge>
                    <span className="text-sm text-muted-foreground">Choose from male avatar options</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(AVATARS)
                      .filter(([_, avatar]) => avatar.gender === 'male')
                      .map(([avatarId, avatar]) => {
                        const AvatarComponent = AvatarComponents[avatarId as AvatarId]
                        const isSelected = selectedAvatar === avatarId
                        
                        return (
                          <button
                            key={avatarId}
                            onClick={() => handleAvatarSelect(avatarId as AvatarId)}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              isSelected 
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <AvatarComponent className="w-12 h-12" />
                              <span className="text-xs text-center text-muted-foreground">
                                {avatar.name}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                  </div>
                </div>

                <Separator />

                {/* Female Avatars */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Female</Badge>
                    <span className="text-sm text-muted-foreground">Choose from female avatar options</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(AVATARS)
                      .filter(([_, avatar]) => avatar.gender === 'female')
                      .map(([avatarId, avatar]) => {
                        const AvatarComponent = AvatarComponents[avatarId as AvatarId]
                        const isSelected = selectedAvatar === avatarId
                        
                        return (
                          <button
                            key={avatarId}
                            onClick={() => handleAvatarSelect(avatarId as AvatarId)}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              isSelected 
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <AvatarComponent className="w-12 h-12" />
                              <span className="text-xs text-center text-muted-foreground">
                                {avatar.name}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    disabled={!selectedAvatar}
                  >
                    {selectedAvatar ? 'Select Avatar' : 'Choose an Avatar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">
          Your avatar will be displayed to other circle members
        </p>
      </div>
    </div>
  )
}
