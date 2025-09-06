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

    // Skip auto-login for join and portal pages to avoid conflicts
    if (pathname === '/join' || pathname === '/portal') return

    // Attempt auto-login
    const success = autoLogin()
    
    if (success) {
      // If we're on the home page, redirect to portal for role-aware routing
      if (pathname === '/') {
        router.push('/portal')
      }
    }
  }, [router, pathname])

  return null // This component doesn't render anything
}
