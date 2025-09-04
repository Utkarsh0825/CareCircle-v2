'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColorSchemeSelector } from '@/components/color-scheme-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from 'next-themes'

const colorSchemes = [
  { id: 'forest-serenity', name: 'Forest Serenity', color: 'bg-green-500' },
  { id: 'warm-sunset', name: 'Warm Sunset', color: 'bg-orange-500' },
  { id: 'ocean-calm', name: 'Ocean Calm', color: 'bg-cyan-500' },
  { id: 'lavender-dreams', name: 'Lavender Dreams', color: 'bg-purple-500' },
  { id: 'rose-garden', name: 'Rose Garden', color: 'bg-pink-500' },
  { id: 'golden-hour', name: 'Golden Hour', color: 'bg-yellow-500' },
]

export default function TestColorsPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Color Scheme Test</h1>
            <p className="text-muted-foreground">Test all 6 color schemes in light and dark modes</p>
          </div>
          <div className="flex gap-2">
            <ColorSchemeSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Current Theme Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Theme Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Badge variant="outline">Theme: {theme}</Badge>
              </div>
              <div>
                <Badge variant="outline">Resolved: {resolvedTheme}</Badge>
              </div>
              <div>
                <Badge variant="outline">
                  Color Scheme: {localStorage.getItem('carecircle-color-scheme') || 'forest-serenity'}
                </Badge>
              </div>
              <div>
                <Badge variant="outline">
                  Data Theme: {document.documentElement.getAttribute('data-theme') || 'none'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorSchemes.map((scheme) => (
            <Card key={scheme.id} className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                  {scheme.name}
                </CardTitle>
                <CardDescription>
                  Test color scheme: {scheme.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    localStorage.setItem('carecircle-color-scheme', scheme.id)
                    document.documentElement.setAttribute('data-theme', scheme.id)
                    document.body.setAttribute('data-theme', scheme.id)
                    window.location.reload()
                  }}
                >
                  Apply {scheme.name}
                </Button>
                
                <div className="space-y-2">
                  <div className="h-4 bg-primary rounded"></div>
                  <div className="h-4 bg-secondary rounded"></div>
                  <div className="h-4 bg-accent rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Component Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Text Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
            <h2 className="text-3xl font-semibold text-foreground">Heading 2</h2>
            <h3 className="text-2xl font-medium text-foreground">Heading 3</h3>
            <p className="text-foreground">This is regular text with foreground color.</p>
            <p className="text-muted-foreground">This is muted text for secondary information.</p>
            <p className="text-primary">This is primary colored text.</p>
            <p className="text-secondary">This is secondary colored text.</p>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Input Field</label>
              <input 
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                placeholder="Type something..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Textarea</label>
              <textarea 
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                placeholder="Enter your message..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
