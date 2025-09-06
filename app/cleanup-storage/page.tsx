'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Heart, Check, AlertCircle, Trash2 } from 'lucide-react'
import { getRoot, updateRoot } from '@/lib/localStore'

export default function CleanupStoragePage() {
  const router = useRouter()
  const [cleaned, setCleaned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itemsRemoved, setItemsRemoved] = useState<string[]>([])

  const performCleanup = () => {
    try {
      const root = getRoot()
      const removed: string[] = []
      
      // Clean up old symptom data if it exists and user wants to remove it
      if (root.symptoms && root.symptoms.length > 0) {
        removed.push(`${root.symptoms.length} symptom entries`)
      }

      // Update root to remove symptoms completely
      updateRoot(prev => {
        const newRoot = { ...prev }
        delete newRoot.symptoms
        return newRoot
      })

      setItemsRemoved(removed)
      setCleaned(true)
    } catch (err) {
      setError('Failed to clean up storage data')
      console.error('Cleanup error:', err)
    }
  }

  useEffect(() => {
    // Auto-perform cleanup on load
    performCleanup()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <Trash2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Storage Cleanup</CardTitle>
            <CardDescription>
              {error ? (
                "There was an issue cleaning up your data."
              ) : cleaned ? (
                "Successfully cleaned up your storage data."
              ) : (
                "Cleaning up storage data..."
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
            ) : cleaned ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Cleanup completed!</span>
                </div>
                {itemsRemoved.length > 0 && (
                  <div className="mt-2 text-xs text-green-600">
                    <p>Removed:</p>
                    <ul className="list-disc list-inside">
                      {itemsRemoved.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Button 
              onClick={() => router.push('/dashboard')} 
              className="w-full"
              disabled={!cleaned && !error}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
