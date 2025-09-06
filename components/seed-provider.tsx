'use client'

import { useEffect } from 'react'
import { seedIfEmpty, assignDemoAvatars, updatePatientToWarrior, clearPreviousVersions } from '@/lib/localStore'

export function SeedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clear previous versions first, then seed fresh data
    clearPreviousVersions()
    seedIfEmpty()
    assignDemoAvatars()
    updatePatientToWarrior()
  }, [])

  return <>{children}</>
}

