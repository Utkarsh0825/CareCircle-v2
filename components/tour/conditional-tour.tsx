'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TourTooltip } from './tour-tooltip'

export function ConditionalTourComponents() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Don't render anything during SSR or on auth pages
  if (!isClient) {
    return null
  }
  
  // Don't render tour components on auth pages
  const isAuthPage = pathname?.startsWith('/auth/') || pathname === '/join'
  
  if (isAuthPage) {
    return null
  }
  
  return <TourTooltip />
}
