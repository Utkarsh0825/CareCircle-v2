'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ThemeApplier() {
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    // Apply saved color scheme and theme on mount and theme changes
    const applyTheme = () => {
      const savedScheme = localStorage.getItem('carecircle-color-scheme') || 'forest-serenity'
      const currentTheme = theme === 'system' ? systemTheme : theme
      
      const htmlElement = document.documentElement
      const bodyElement = document.body
      
      if (htmlElement && bodyElement) {
        // Clear any existing theme attributes first
        htmlElement.removeAttribute('data-theme')
        bodyElement.removeAttribute('data-theme')
        
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
    }

    applyTheme()

    // Listen for storage changes (when color scheme changes)
    const handleStorageChange = () => {
      applyTheme()
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [theme, systemTheme])

  return null // This component doesn't render anything
}
