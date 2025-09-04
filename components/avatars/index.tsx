export { MaleAvatar1 } from './male-avatar-1'
export { MaleAvatar2 } from './male-avatar-2'
export { MaleAvatar3 } from './male-avatar-3'
export { MaleAvatar4 } from './male-avatar-4'
export { MaleAvatar5 } from './male-avatar-5'
export { FemaleAvatar1 } from './female-avatar-1'
export { FemaleAvatar2 } from './female-avatar-2'
export { FemaleAvatar3 } from './female-avatar-3'
export { FemaleAvatar4 } from './female-avatar-4'
export { FemaleAvatar5 } from './female-avatar-5'

export const AVATARS = {
  'male-1': { component: 'MaleAvatar1', gender: 'male', name: 'Classic Male' },
  'male-2': { component: 'MaleAvatar2', gender: 'male', name: 'Bold Male' },
  'male-3': { component: 'MaleAvatar3', gender: 'male', name: 'Friendly Male' },
  'male-4': { component: 'MaleAvatar4', gender: 'male', name: 'Professional Male' },
  'male-5': { component: 'MaleAvatar5', gender: 'male', name: 'Casual Male' },
  'female-1': { component: 'FemaleAvatar1', gender: 'female', name: 'Classic Female' },
  'female-2': { component: 'FemaleAvatar2', gender: 'female', name: 'Bold Female' },
  'female-3': { component: 'FemaleAvatar3', gender: 'female', name: 'Friendly Female' },
  'female-4': { component: 'FemaleAvatar4', gender: 'female', name: 'Professional Female' },
  'female-5': { component: 'FemaleAvatar5', gender: 'female', name: 'Casual Female' },
} as const

export type AvatarId = keyof typeof AVATARS
