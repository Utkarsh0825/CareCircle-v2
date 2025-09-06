'use client'

import * as React from 'react'
import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const colorSchemes = [
  { id: 'forest-serenity', name: 'Forest Serenity', color: 'bg-green-500' },
  { id: 'warm-sunset', name: 'Warm Sunset', color: 'bg-orange-500' },
  { id: 'ocean-calm', name: 'Ocean Calm', color: 'bg-cyan-500' },
  { id: 'lavender-dreams', name: 'Lavender Dreams', color: 'bg-purple-500' },
  { id: 'rose-garden', name: 'Rose Garden', color: 'bg-pink-500' },
  { id: 'golden-hour', name: 'Golden Hour', color: 'bg-yellow-500' },
]

export function ColorSchemeSelector() {
  const [mounted, setMounted] = React.useState(false)
  const [currentScheme, setCurrentScheme] = React.useState('forest-serenity')

  React.useEffect(() => {
    setMounted(true)
    const savedScheme = localStorage.getItem('carecircle-color-scheme') || 'forest-serenity'
    setCurrentScheme(savedScheme)
  }, [])

  const applyColorScheme = (schemeId: string) => {
    try {
      localStorage.setItem('carecircle-color-scheme', schemeId)
      setCurrentScheme(schemeId)
      
      const htmlElement = document.documentElement
      const bodyElement = document.body
      const isDark = htmlElement.classList.contains('dark')
      
      if (htmlElement && bodyElement) {
        // Clear existing theme attributes
        htmlElement.removeAttribute('data-theme')
        bodyElement.removeAttribute('data-theme')
        
        // Always set the data-theme attribute for all color schemes
        htmlElement.setAttribute('data-theme', schemeId)
        bodyElement.setAttribute('data-theme', schemeId)
        
        // Maintain dark mode state
        if (isDark) {
          htmlElement.classList.add('dark')
          bodyElement.classList.add('dark')
        } else {
          htmlElement.classList.remove('dark')
          bodyElement.classList.remove('dark')
        }
      }
    } catch (error) {
      console.warn('Failed to apply color scheme:', error)
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Palette className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Color scheme</span>
      </Button>
    )
  }

  const currentSchemeData = colorSchemes.find(scheme => scheme.id === currentScheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" id="color-scheme-selector">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Color scheme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {colorSchemes.map((scheme) => (
          <DropdownMenuItem
            key={scheme.id}
            onClick={() => applyColorScheme(scheme.id)}
            className="flex items-center gap-3"
          >
            <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
            <span>{scheme.name}</span>
            {currentScheme === scheme.id && (
              <span className="ml-auto text-xs text-muted-foreground">Current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
