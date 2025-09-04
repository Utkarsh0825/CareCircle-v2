'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { autoLogin } from '@/lib/session'

export function AutoLogin() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only attempt auto-login on client side
    if (typeof window === 'undefined') return

    // Skip auto-login for auth pages
    if (pathname.startsWith('/auth/')) return

    // Attempt auto-login
    const success = autoLogin()
    
    if (success) {
      // If we're on the home page, redirect to dashboard
      if (pathname === '/') {
        router.push('/dashboard')
      }
    }
  }, [router, pathname])

  return null // This component doesn't render anything
}
