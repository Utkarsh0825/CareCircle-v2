'use client'

import { useEffect } from 'react'
import { seedIfEmpty, assignDemoAvatars, updatePatientToWarrior } from '@/lib/localStore'

export function SeedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedIfEmpty()
    assignDemoAvatars()
    updatePatientToWarrior()
  }, [])

  return <>{children}</>
}

