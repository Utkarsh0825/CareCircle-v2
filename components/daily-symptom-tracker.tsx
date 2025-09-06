'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Save, 
  Check, 
  AlertCircle,
  Utensils,
  Moon,
  Heart,
  Zap,
  Scissors
} from 'lucide-react'
import { 
  getRoot, 
  addSymptomEntry, 
  updateSymptomEntry, 
  getSymptomByDate, 
  type SymptomEntry 
} from '@/lib/localStore'
import { getSession } from '@/lib/session'

// Symptom configuration with icons and descriptions
const SYMPTOMS = [
  {
    key: 'nausea' as const,
    label: 'Nausea',
    icon: '🤢',
    description: 'Feeling sick to your stomach'
  },
  {
    key: 'fatigue' as const,
    label: 'Fatigue',
    icon: '😴',
    description: 'Feeling tired or exhausted'
  },
  {
    key: 'pain' as const,
    label: 'Pain',
    icon: '😣',
    description: 'Physical discomfort or aches'
  },
  {
    key: 'appetite' as const,
    label: 'Appetite',
    icon: '🍽️',
    description: 'Desire to eat food'
  },
  {
    key: 'sleep' as const,
    label: 'Sleep',
    icon: '😴',
    description: 'Quality of sleep last night'
  },
  {
    key: 'mood' as const,
    label: 'Mood',
    icon: '😊',
    description: 'Overall emotional well-being'
  },
  {
    key: 'energy' as const,
    label: 'Energy',
    icon: '⚡',
    description: 'Physical energy levels'
  },
  {
    key: 'hairLoss' as const,
    label: 'Hair Loss',
    icon: '💇',
    description: 'Hair thinning or loss'
  }
]

// Rating scale descriptions (1-5 scale)
const RATING_LABELS = [
  'Very Mild/Very Good', 
  'Mild/Good',
  'Moderate/Fair',
  'Severe/Poor',
  'Very Severe/Very Poor'
]

interface DailySymptomTrackerProps {
  groupId: string
  userId: string
  onSave?: (entry: SymptomEntry) => void
}

export function DailySymptomTracker({ groupId, userId, onSave }: DailySymptomTrackerProps) {
  const [symptoms, setSymptoms] = useState({
    nausea: 1,
    fatigue: 1,
    pain: 1,
    appetite: 1,
    sleep: 1,
    mood: 1,
    energy: 1,
    hairLoss: 1
  })
  const [notes, setNotes] = useState('')
  const [isLoading, setSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [existingEntry, setExistingEntry] = useState<SymptomEntry | null>(null)

  const today = new Date().toISOString().split('T')[0]

  // Load existing entry for today
  useEffect(() => {
    const entry = getSymptomByDate(userId, groupId, today)
    if (entry) {
      setExistingEntry(entry)
      setSymptoms(entry.symptoms)
      setNotes(entry.notes || '')
      setIsSaved(true)
    }
  }, [userId, groupId, today])

  const handleSymptomChange = (symptomKey: keyof typeof symptoms, value: number) => {
    setSymptoms(prev => ({
      ...prev,
      [symptomKey]: value
    }))
    setIsSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      let savedEntry: SymptomEntry

      if (existingEntry) {
        // Update existing entry
        const updated = updateSymptomEntry(existingEntry.id, {
          symptoms,
          notes: notes.trim() || undefined
        })
        savedEntry = updated!
      } else {
        // Create new entry
        savedEntry = addSymptomEntry({
          groupId,
          userId,
          date: today,
          symptoms,
          notes: notes.trim() || undefined
        })
        setExistingEntry(savedEntry)
      }

      setIsSaved(true)
      onSave?.(savedEntry)

      // Show success briefly
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)

    } catch (error) {
      console.error('Failed to save symptom entry:', error)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = existingEntry ? (
    JSON.stringify(symptoms) !== JSON.stringify(existingEntry.symptoms) ||
    (notes.trim() || '') !== (existingEntry.notes || '')
  ) : Object.values(symptoms).some(v => v > 1) || notes.trim()

  const getSymptomColor = (value: number) => {
    if (value === 1) return 'bg-green-100 border-green-200'
    if (value <= 2) return 'bg-green-100 border-green-200'
    if (value <= 3) return 'bg-yellow-100 border-yellow-200'
    if (value <= 4) return 'bg-orange-100 border-orange-200'
    return 'bg-red-100 border-red-200'
  }

  const getSymptomTextColor = (value: number) => {
    if (value === 1) return 'text-green-700'
    if (value <= 2) return 'text-green-700'
    if (value <= 3) return 'text-yellow-700'
    if (value <= 4) return 'text-orange-700'
    return 'text-red-700'
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Daily Symptom Tracker
        </CardTitle>
        <CardDescription>
          Track common chemo side effects and symptoms daily
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Symptoms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SYMPTOMS.map((symptom) => (
            <div key={symptom.key} className="space-y-2">
              <div className="text-center">
                <div className="text-2xl mb-1">{symptom.icon}</div>
                <div className="font-medium text-sm">{symptom.label}</div>
                <div className="text-xs text-muted-foreground">{symptom.description}</div>
              </div>
              
              {/* Rating buttons */}
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleSymptomChange(symptom.key, rating)}
                      className={`
                        w-6 h-6 rounded-full border-2 text-xs font-medium transition-all
                        ${symptoms[symptom.key] === rating 
                          ? `${getSymptomColor(rating)} ${getSymptomTextColor(rating)} border-current` 
                          : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                        }
                      `}
                      title={`${rating} - ${RATING_LABELS[rating - 1]}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current rating display */}
              {symptoms[symptom.key] > 1 && (
                <div className="text-center">
                  <Badge 
                    variant="outline" 
                    className={`${getSymptomColor(symptoms[symptom.key])} ${getSymptomTextColor(symptoms[symptom.key])} text-xs`}
                  >
                    {RATING_LABELS[symptoms[symptom.key] - 1]}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Notes section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (Optional)</label>
          <Textarea
            placeholder="How are you feeling today? Any additional details about your symptoms..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              setIsSaved(false)
            }}
            className="min-h-[80px]"
          />
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {existingEntry ? `Last updated: ${new Date(existingEntry.updatedAt).toLocaleTimeString()}` : 'Not saved yet'}
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Today's Entry
              </>
            )}
          </Button>
        </div>

        {/* Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Tip:</p>
              <p className="text-blue-700">
                Track symptoms daily to help your care team understand patterns and adjust treatment accordingly.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
