'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Heart, Check, AlertCircle } from 'lucide-react'
import { getRoot, updateRoot } from '@/lib/localStore'

export default function MigrateSymptomsPage() {
  const router = useRouter()
  const [migrated, setMigrated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const root = getRoot()
      
      // Check if symptoms array is missing
      if (!root.symptoms) {
        // Add symptoms array to existing data
        updateRoot(prev => ({
          ...prev,
          symptoms: []
        }))
        setMigrated(true)
      } else {
        setMigrated(true)
      }
    } catch (err) {
      setError('Failed to migrate symptoms data')
      console.error('Migration error:', err)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Symptoms Tracking Added!</CardTitle>
            <CardDescription>
              {error ? (
                "There was an issue updating your data."
              ) : migrated ? (
                "Your account has been updated to support symptom tracking."
              ) : (
                "Updating your account to support symptom tracking..."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            ) : migrated ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Successfully updated!</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
              disabled={!migrated && !error}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
