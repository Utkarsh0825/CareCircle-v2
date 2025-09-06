'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info
} from 'lucide-react'
import { 
  getRoot, 
  getSymptomsByUser, 
  type SymptomEntry 
} from '@/lib/localStore'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

// Symptom configuration
const SYMPTOMS = [
  { key: 'nausea' as const, label: 'Nausea', icon: '🤢' },
  { key: 'fatigue' as const, label: 'Fatigue', icon: '😴' },
  { key: 'pain' as const, label: 'Pain', icon: '😣' },
  { key: 'appetite' as const, label: 'Appetite', icon: '🍽️' },
  { key: 'sleep' as const, label: 'Sleep', icon: '😴' },
  { key: 'mood' as const, label: 'Mood', icon: '😊' },
  { key: 'energy' as const, label: 'Energy', icon: '⚡' },
  { key: 'hairLoss' as const, label: 'Hair Loss', icon: '💇' }
]

const RATING_LABELS = [
  'Very Mild/Very Good', 
  'Mild/Good',
  'Moderate/Fair',
  'Severe/Poor',
  'Very Severe/Very Poor'
]

interface PatientSymptomsViewProps {
  groupId: string
  patientUserId: string
  patientName: string
}

export function PatientSymptomsView({ groupId, patientUserId, patientName }: PatientSymptomsViewProps) {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const entries = getSymptomsByUser(patientUserId, groupId)
    setSymptoms(entries)
    setLoading(false)
  }, [patientUserId, groupId])

  const getSymptomColor = (value: number) => {
    if (value === 1) return 'bg-green-100 text-green-700'
    if (value <= 2) return 'bg-green-100 text-green-700'
    if (value <= 3) return 'bg-yellow-100 text-yellow-700'
    if (value <= 4) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  const getOverallSeverity = (entry: SymptomEntry) => {
    const values = Object.values(entry.symptoms)
    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    const max = Math.max(...values)
    
    if (max >= 5) return { level: 'high', label: 'High', color: 'bg-red-100 text-red-700' }
    if (max >= 4 || average >= 3.5) return { level: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' }
    if (average >= 2) return { level: 'mild', label: 'Mild', color: 'bg-green-100 text-green-700' }
    return { level: 'minimal', label: 'Minimal', color: 'bg-green-100 text-green-700' }
  }

  const getWorseningSymptoms = (entries: SymptomEntry[]) => {
    if (entries.length < 2) return []
    
    const latest = entries[0]
    const previous = entries[1]
    const worsening = []

    SYMPTOMS.forEach(symptom => {
      const latestValue = latest.symptoms[symptom.key]
      const previousValue = previous.symptoms[symptom.key]
      if (latestValue > previousValue && latestValue >= 3) {
        worsening.push({
          ...symptom,
          increase: latestValue - previousValue,
          current: latestValue
        })
      }
    })

    return worsening
  }

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">Loading symptoms...</div>
        </CardContent>
      </Card>
    )
  }

  if (symptoms.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {patientName}'s Symptoms
          </CardTitle>
          <CardDescription>
            Daily symptom tracking from the patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No symptom entries yet</div>
            <div className="text-sm text-muted-foreground">
              The patient hasn't started tracking symptoms daily yet.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestEntry = symptoms[0]
  const severity = getOverallSeverity(latestEntry)
  const worseningSymptoms = getWorseningSymptoms(symptoms)
  const displayedSymptoms = expanded ? symptoms : symptoms.slice(0, 3)

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {patientName}'s Symptoms
        </CardTitle>
        <CardDescription>
          Daily symptom tracking from the patient
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Entry Summary */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div>
            <div className="font-medium">Latest Entry</div>
            <div className="text-sm text-muted-foreground">
              {format(parseISO(latestEntry.date), 'EEEE, MMMM d')} 
              <span className="ml-2">
                ({formatDistanceToNow(parseISO(latestEntry.createdAt), { addSuffix: true })})
              </span>
            </div>
          </div>
          <Badge className={severity.color}>
            {severity.label} Symptoms
          </Badge>
        </div>

        {/* Worsening Symptoms Alert */}
        {worseningSymptoms.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-900 mb-1">Symptoms Getting Worse</p>
                <div className="flex flex-wrap gap-1">
                  {worseningSymptoms.map(symptom => (
                    <Badge key={symptom.key} variant="outline" className="text-orange-700 border-orange-300">
                      {symptom.icon} {symptom.label} (+{symptom.increase})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Entries */}
        <div className="space-y-3">
          {displayedSymptoms.map((entry, index) => (
            <div key={entry.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(parseISO(entry.date), 'EEEE, MMM d')}
                  </span>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">Latest</Badge>
                  )}
                </div>
                <Badge className={getOverallSeverity(entry).color}>
                  {getOverallSeverity(entry).label}
                </Badge>
              </div>

              {/* Symptoms Grid */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {SYMPTOMS.map(symptom => {
                  const value = entry.symptoms[symptom.key]
                  return (
                    <div key={symptom.key} className="text-center">
                      <div className="text-lg mb-1">{symptom.icon}</div>
                      <div className="text-xs font-medium mb-1">{symptom.label}</div>
                      <Badge 
                        variant="outline" 
                        className={`${getSymptomColor(value)} text-xs px-1 py-0`}
                      >
                        {value}
                      </Badge>
                    </div>
                  )
                })}
              </div>

              {/* Notes */}
              {entry.notes && (
                <div className="bg-muted/30 rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Notes:</div>
                  <div className="text-sm">{entry.notes}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {symptoms.length > 3 && (
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show {symptoms.length - 3} More Entries
              </>
            )}
          </Button>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">For Caregivers:</p>
              <p className="text-blue-700">
                Monitor symptom patterns and reach out if you notice worsening symptoms or concerning trends.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
