'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function ThemeApplier() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply saved color scheme and theme on mount and theme changes
    const applyTheme = () => {
      try {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          const savedScheme = localStorage.getItem('carecircle-color-scheme') || 'forest-serenity'
          const currentTheme = theme === 'system' ? systemTheme : theme
          
          const htmlElement = document.documentElement
          const bodyElement = document.body
          
          if (htmlElement && bodyElement) {
            // Clear any existing theme attributes first
            if (htmlElement.hasAttribute('data-theme')) {
              htmlElement.removeAttribute('data-theme')
            }
            if (bodyElement.hasAttribute('data-theme')) {
              bodyElement.removeAttribute('data-theme')
            }
            
            // Set the data-theme attribute for custom color schemes
            if (savedScheme !== 'forest-serenity') {
              htmlElement.setAttribute('data-theme', savedScheme)
              bodyElement.setAttribute('data-theme', savedScheme)
            }
            
            // Apply dark mode class
            if (currentTheme === 'dark') {
              htmlElement.classList.add('dark')
              bodyElement.classList.add('dark')
            } else {
              htmlElement.classList.remove('dark')
              bodyElement.classList.remove('dark')
            }
          }
        })
      } catch (error) {
        console.warn('Theme application error:', error)
      }
    }

    // Delay initial application
    setTimeout(applyTheme, 0)

    // Listen for storage changes (when color scheme changes)
    const handleStorageChange = () => {
      setTimeout(applyTheme, 0)
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [theme, systemTheme, mounted])

  return null // This component doesn't render anything
}
