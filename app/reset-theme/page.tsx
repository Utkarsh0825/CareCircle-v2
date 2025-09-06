'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function ResetThemePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Reset theme to default
    const htmlElement = document.documentElement
    const bodyElement = document.body
    
    if (htmlElement && bodyElement) {
      // Set theme to forest-serenity (default)
      htmlElement.setAttribute('data-theme', 'forest-serenity')
      bodyElement.setAttribute('data-theme', 'forest-serenity')
      
      // Remove dark mode
      htmlElement.classList.remove('dark')
      bodyElement.classList.remove('dark')
      
      // Reset localStorage
      localStorage.setItem('carecircle-color-scheme', 'forest-serenity')
      localStorage.setItem('theme', 'light')
    }
  }, [])

  const handleReset = () => {
    // Force reset
    const htmlElement = document.documentElement
    const bodyElement = document.body
    
    if (htmlElement && bodyElement) {
      // Set theme to forest-serenity (default)
      htmlElement.setAttribute('data-theme', 'forest-serenity')
      bodyElement.setAttribute('data-theme', 'forest-serenity')
      
      // Remove dark mode
      htmlElement.classList.remove('dark')
      bodyElement.classList.remove('dark')
      
      // Reset localStorage
      localStorage.setItem('carecircle-color-scheme', 'forest-serenity')
      localStorage.setItem('theme', 'light')
      
      // Reload page
      window.location.reload()
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Reset Theme</CardTitle>
            <CardDescription>
              This page will reset your theme to the default Forest Serenity (Green) theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The theme has been reset to the default green theme. You should now see:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Green primary colors instead of red/pink</li>
              <li>Light mode by default</li>
              <li>Clean, consistent color scheme</li>
            </ul>
            
            <div className="flex gap-4">
              <Button onClick={handleReset}>
                Force Reset & Reload
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
