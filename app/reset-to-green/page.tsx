'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function ResetToGreenPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [reset, setReset] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Reset to green theme
    const htmlElement = document.documentElement
    const bodyElement = document.body
    
    if (htmlElement && bodyElement) {
      // Set theme to forest-serenity (green)
      htmlElement.setAttribute('data-theme', 'forest-serenity')
      bodyElement.setAttribute('data-theme', 'forest-serenity')
      
      // Remove dark mode
      htmlElement.classList.remove('dark')
      bodyElement.classList.remove('dark')
      
      // Reset localStorage
      localStorage.setItem('carecircle-color-scheme', 'forest-serenity')
      localStorage.setItem('theme', 'light')
      
      setReset(true)
    }
  }, [])

  const handleGoHome = () => {
    router.push('/')
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Reset Complete
          </CardTitle>
          <CardDescription>
            Your theme has been reset to Forest Serenity (Green)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reset && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Color scheme reset to <strong>Forest Serenity (Green)</strong>
              </p>
              <p className="text-sm text-green-800 mt-1">
                ✅ Theme set to <strong>Light Mode</strong>
              </p>
              <p className="text-sm text-green-800 mt-1">
                ✅ localStorage cleared and updated
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button onClick={handleGoHome} className="w-full">
              Go to Home Page
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>The page should now show green colors by default.</p>
            <p>You can still change colors in Settings if needed.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
