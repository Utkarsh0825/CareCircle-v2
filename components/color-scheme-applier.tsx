'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ColorSchemeApplier() {
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const applyColorScheme = () => {
      try {
        let savedScheme = localStorage.getItem('carecircle-color-scheme')
        
        // If no saved scheme or if it's an invalid scheme, default to forest-serenity
        const validSchemes = ['forest-serenity', 'warm-sunset', 'ocean-calm', 'lavender-dreams', 'rose-garden', 'golden-hour']
        if (!savedScheme || !validSchemes.includes(savedScheme)) {
          savedScheme = 'forest-serenity'
          localStorage.setItem('carecircle-color-scheme', savedScheme)
        }
        
        const currentTheme = theme === 'system' ? systemTheme : theme
        
        const htmlElement = document.documentElement
        const bodyElement = document.body
        
        if (htmlElement && bodyElement) {
          // Clear any existing theme attributes first
          htmlElement.removeAttribute('data-theme')
          bodyElement.removeAttribute('data-theme')
          
          // Always set the data-theme attribute for all color schemes
          htmlElement.setAttribute('data-theme', savedScheme)
          bodyElement.setAttribute('data-theme', savedScheme)
          
          // Apply dark mode class
          if (currentTheme === 'dark') {
            htmlElement.classList.add('dark')
            bodyElement.classList.add('dark')
          } else {
            htmlElement.classList.remove('dark')
            bodyElement.classList.remove('dark')
          }
        }
      } catch (error) {
        // Silently handle errors in SSR/hydration
      }
    }

    // Apply on mount and theme changes
    applyColorScheme()

    // Listen for storage changes (when color scheme changes from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carecircle-color-scheme') {
        applyColorScheme()
      }
    }

    // Listen for custom events (more reliable than storage events)
    const handleCustomEvent = () => {
      applyColorScheme()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('carecircle-color-change', handleCustomEvent)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('carecircle-color-change', handleCustomEvent)
    }
  }, [theme, systemTheme])

  return null // This component doesn't render anything
}
