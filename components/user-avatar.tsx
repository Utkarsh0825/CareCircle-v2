'use client'

import { 
  MaleAvatar1, MaleAvatar2, MaleAvatar3, MaleAvatar4, MaleAvatar5,
  FemaleAvatar1, FemaleAvatar2, FemaleAvatar3, FemaleAvatar4, FemaleAvatar5,
  type AvatarId 
} from '@/components/avatars'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  avatarId?: string
  name?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showFallback?: boolean
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

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

export function UserAvatar({ 
  avatarId, 
  name, 
  className, 
  size = 'md',
  showFallback = true 
}: UserAvatarProps) {
  const AvatarComponent = avatarId ? AvatarComponents[avatarId as AvatarId] : null
  const sizeClass = sizeClasses[size]
  const iconSize = iconSizes[size]


  if (AvatarComponent) {
    return (
      <div className={cn("rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden", sizeClass, className)}>
        <AvatarComponent className={sizeClass} />
      </div>
    )
  }

  // Always show fallback if no avatar is selected
  return (
    <div className={cn("rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center", sizeClass, className)}>
      <User className={cn("text-gray-500 dark:text-gray-400", iconSize)} />
    </div>
  )
}
