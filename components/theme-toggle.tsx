'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Apply theme changes immediately
    try {
      const colorScheme = localStorage.getItem('carecircle-color-scheme') || 'forest-serenity'
      const htmlElement = document.documentElement
      const bodyElement = document.body
      
      if (htmlElement && bodyElement) {
        // Clear existing theme attributes
        htmlElement.removeAttribute('data-theme')
        bodyElement.removeAttribute('data-theme')
        
        // Set the data-theme attribute for custom color schemes
        if (colorScheme !== 'forest-serenity') {
          htmlElement.setAttribute('data-theme', colorScheme)
          bodyElement.setAttribute('data-theme', colorScheme)
        }
        
        // Apply dark mode class
        if (newTheme === 'dark') {
          htmlElement.classList.add('dark')
          bodyElement.classList.add('dark')
        } else {
          htmlElement.classList.remove('dark')
          bodyElement.classList.remove('dark')
        }
      }
    } catch (error) {
      console.warn('Failed to set theme:', error)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      id="theme-toggle"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
