'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageCircle, Smile, Meh, Frown, AlertTriangle, HelpCircle, Calendar, Target, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { GroupChat } from '@/components/group-chat'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { format, addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears, differenceInDays, differenceInWeeks, differenceInMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isSameDay, isSameMonth, isSameYear, isToday } from 'date-fns'

export default function UpdatesPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<'GOOD' | 'OKAY' | 'BAD'>('OKAY')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  
  // Chemo Progress Tracking
  const [chemoStartDate, setChemoStartDate] = useState('')
  const [chemoCycleLength, setChemoCycleLength] = useState(21) // Default 3 weeks
  const [totalCycles, setTotalCycles] = useState(6)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [showChemoTracker, setShowChemoTracker] = useState(false)
  
  // Calendar View State
  const [calendarView, setCalendarView] = useState<'week' | 'month' | 'year'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledDates, setScheduledDates] = useState<string[]>([])
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'chat' | 'chemo'>('chat')

  useEffect(() => {
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  // Get user's role in this group
  const userMembership = root.members.find(
    m => m.groupId === session.group!.id && m.userId === session.user!.id && m.status === 'ACTIVE'
  )
  const userRole = userMembership?.role || 'CAREGIVER'
  const isPatient = userRole === 'PATIENT'
  const canPostUpdates = isPatient

  const updates = root.updates
    .filter(u => u.groupId === session.group!.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const newUpdate = {
        id: `update-${Date.now()}`,
        groupId: session.group!.id,
        authorId: session.user!.id,
        mood,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        visibility: 'members' as const
      }

      // Add update to storage
      updateRoot(prev => ({
        ...prev,
        updates: [newUpdate, ...prev.updates]
      }))

      // Check if this is a bad day and should trigger alert
      if (mood === 'BAD') {
        const lastAlertAt = root.session?.lastAlertAt
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        
        if (!lastAlertAt || lastAlertAt < twelveHoursAgo) {
          // Send bad day alert
          const activeMembers = root.members
            .filter(m => m.groupId === session.group!.id && m.status === 'ACTIVE')
            .map(m => root.users[m.userId])
            .filter(Boolean)

          const alertMail = {
            id: `mail-${Date.now()}`,
            to: activeMembers.map(u => u!.email),
            subject: 'Bad Day Alert: Let\'s Rally Today',
            html: `
              <h2>Bad Day Alert</h2>
              <p>${session.user.name || session.user.email} is having a difficult day and could use extra support.</p>
              <p><strong>Update:</strong> ${content}</p>
              <p>Please check the calendar for any unclaimed tasks today and consider reaching out with extra support.</p>
              <p><a href="/dashboard/calendar?filter=unclaimed&date=${new Date().toISOString().split('T')[0]}">View Today's Tasks</a></p>
            `,
            text: `Bad Day Alert: ${session.user.name || session.user.email} is having a difficult day. Please check the calendar for unclaimed tasks and consider reaching out with extra support.`,
            createdAt: new Date().toISOString(),
            meta: { type: 'bad-day-alert' }
          }

          updateRoot(prev => ({
            ...prev,
            mailbox: [...prev.mailbox, alertMail],
            session: { ...prev.session, lastAlertAt: new Date().toISOString() }
          }))

          setShowAlert(true)
          setTimeout(() => setShowAlert(false), 5000)
        }
      }

      // Reset form
      setContent('')
      setMood('OKAY')
      
      // Refresh data
      setRoot(getRoot())
    } catch (error) {
      console.error('Failed to post update:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

const getMoodIcon = (mood: string) => {
  switch (mood) {
      case 'GOOD': return <Smile className="h-4 w-4" />
      case 'OKAY': return <Meh className="h-4 w-4" />
      case 'BAD': return <Frown className="h-4 w-4" />
      default: return <Meh className="h-4 w-4" />
    }
  }

  const getMoodVariant = (mood: string) => {
  switch (mood) {
      case 'GOOD': return 'default'
      case 'OKAY': return 'secondary'
      case 'BAD': return 'destructive'
      default: return 'secondary'
    }
  }

  // Chemo Progress Calculations
  const calculateChemoProgress = () => {
    if (!chemoStartDate) return null
    
    const startDate = new Date(chemoStartDate)
    const today = new Date()
    const daysSinceStart = differenceInDays(today, startDate)
    const completedCycles = Math.floor(daysSinceStart / chemoCycleLength)
    const currentCycleDay = (daysSinceStart % chemoCycleLength) + 1
    const nextCycleDate = addDays(startDate, (completedCycles + 1) * chemoCycleLength)
    const progressPercentage = Math.min((completedCycles / totalCycles) * 100, 100)
    
    return {
      daysSinceStart,
      completedCycles,
      currentCycleDay,
      nextCycleDate,
      progressPercentage,
      isOnTreatmentDay: currentCycleDay <= 7, // First week of cycle is typically treatment
      isRecoveryWeek: currentCycleDay > 7 && currentCycleDay <= 14, // Second week is recovery
      isPreparationWeek: currentCycleDay > 14 // Third week is preparation for next cycle
    }
  }

  const getCyclePhase = (cycleDay: number) => {
    if (cycleDay <= 7) return { phase: 'Treatment', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    if (cycleDay <= 14) return { phase: 'Recovery', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
    return { phase: 'Preparation', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  }

  const chemoProgress = calculateChemoProgress()

  // Calendar Generation Functions
  const generateCalendarDays = () => {
    switch (calendarView) {
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday start
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
        return eachDayOfInterval({ start: weekStart, end: weekEnd })
      
      case 'month':
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
        
        // Add padding days to fill the grid
        const firstDay = monthStart.getDay()
        const paddingStart = firstDay === 0 ? 6 : firstDay - 1 // Adjust for Monday start
        const paddingEnd = 42 - monthDays.length - paddingStart // 6 rows * 7 days = 42
        
        const paddingStartDays = Array.from({ length: paddingStart }, (_, i) => 
          subDays(monthStart, paddingStart - i)
        )
        const paddingEndDays = Array.from({ length: paddingEnd }, (_, i) => 
          addDays(monthEnd, i + 1)
        )
        
        return [...paddingStartDays, ...monthDays, ...paddingEndDays]
      
      case 'year':
        const yearStart = startOfYear(currentDate)
        const yearEnd = endOfYear(currentDate)
        return eachMonthOfInterval({ start: yearStart, end: yearEnd })
      
    default:
        return []
    }
  }

  const navigateCalendar = (direction: 'prev' | 'next') => {
    switch (calendarView) {
      case 'week':
        setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
        break
      case 'month':
        setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
        break
      case 'year':
        setCurrentDate(direction === 'next' ? addYears(currentDate, 1) : subYears(currentDate, 1))
        break
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const getCalendarTitle = () => {
    switch (calendarView) {
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
      case 'month':
        return format(currentDate, 'MMMM yyyy')
      case 'year':
        return format(currentDate, 'yyyy')
      default:
        return ''
    }
  }

  const isDateInChemoCycle = (date: Date) => {
    if (!chemoStartDate || !chemoProgress) return false
    
    const startDate = new Date(chemoStartDate)
    const daysSinceStart = differenceInDays(date, startDate)
    const cycleDay = (daysSinceStart % chemoCycleLength) + 1
    
    return daysSinceStart >= 0 && daysSinceStart < (totalCycles * chemoCycleLength)
  }

  const getChemoPhaseForDate = (date: Date) => {
    if (!chemoStartDate) return null
    
    const startDate = new Date(chemoStartDate)
    const daysSinceStart = differenceInDays(date, startDate)
    const cycleDay = (daysSinceStart % chemoCycleLength) + 1
    
    if (daysSinceStart < 0 || daysSinceStart >= (totalCycles * chemoCycleLength)) return null
    
    if (cycleDay <= 7) return { phase: 'Treatment', color: 'bg-red-100 border-red-300 text-red-700' }
    if (cycleDay <= 14) return { phase: 'Recovery', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' }
    return { phase: 'Preparation', color: 'bg-green-100 border-green-300 text-green-700' }
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="space-y-6">
                      <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Daily Updates</h1>
                    <p className="text-muted-foreground">
                      Share how you're feeling and keep your support circle updated.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
                  </div>
                </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('chat')}
            className={`
              px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${activeTab === 'chat' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }
            `}
          >
            Chat Update
          </button>
          <button
            onClick={() => setActiveTab('chemo')}
            className={`
              px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${activeTab === 'chemo' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }
            `}
          >
            Chemo Update
          </button>
        </div>
      </div>

      {showAlert && (
        <Alert id="bad-day-info">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Bad day alert sent to your support circle. They'll be notified to check for unclaimed tasks today.
          </AlertDescription>
        </Alert>
      )}

      {/* Chemo Update Tab Content */}
      {activeTab === 'chemo' && (
        <>
          {/* Calendar Navigation */}
          <Card id="calendar-navigation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Treatment Calendar
          </CardTitle>
          <CardDescription>
            Navigate through weeks, months, and years to plan and track your chemo schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* View Selector */}
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
              <Label htmlFor="view-selector" className="text-sm font-medium">View:</Label>
              <select
                id="view-selector"
                value={calendarView}
                onChange={(e) => setCalendarView(e.target.value as 'week' | 'month' | 'year')}
                className="px-3 py-1.5 border border-input rounded-md text-sm"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowScheduleModal(true)}
                disabled={!selectedDate}
              >
                Schedule Chemo
              </Button>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateCalendar('prev')}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            
            <h3 className="text-lg font-semibold">{getCalendarTitle()}</h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateCalendar('next')}
              className="h-8 w-8 p-0"
            >
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Day Headers */}
            {calendarView !== 'year' && (
              <div className="grid grid-cols-7 bg-muted/50">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* Calendar Days */}
            <div className={`grid ${
              calendarView === 'week' ? 'grid-cols-7' : 
              calendarView === 'month' ? 'grid-cols-7' : 
              'grid-cols-4'
            }`}>
              {calendarDays.map((date, index) => {
                const isCurrentMonth = calendarView === 'month' ? 
                  isSameMonth(date, currentDate) : true
                const isCurrentYear = calendarView === 'year' ? 
                  isSameYear(date, currentDate) : true
                const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
                const isCurrentDay = isToday(date)
                const chemoPhase = getChemoPhaseForDate(date)
                
                return (
                  <div
                    key={index}
                    className={`
                      p-2 border-r border-b min-h-[60px] cursor-pointer transition-colors
                      ${isCurrentMonth && isCurrentYear ? 'bg-background' : 'bg-muted/30'}
                      ${isSelected ? 'bg-primary/20 border-primary' : ''}
                      ${isCurrentDay ? 'ring-2 ring-primary ring-offset-1' : ''}
                      ${chemoPhase ? chemoPhase.color : ''}
                      hover:bg-muted/50
                    `}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {calendarView === 'year' ? format(date, 'MMM') : format(date, 'd')}
                    </div>
                    
                    {chemoPhase && (
                      <div className="text-xs font-medium opacity-80">
                        {chemoPhase.phase}
                      </div>
                    )}
                    
                    {calendarView === 'year' && (
                      <div className="text-xs text-muted-foreground">
                        {format(date, 'yyyy')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Selected Date:</span>
                <span className="text-primary font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              
              {(() => {
                const chemoPhase = getChemoPhaseForDate(selectedDate)
                return chemoPhase && (
                  <div className="text-sm">
                    <span className="font-medium">Phase: </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${chemoPhase.color}`}>
                      {chemoPhase.phase}
                    </span>
        </div>
                )
              })()}
              
              {(() => {
                const chemoPhase = getChemoPhaseForDate(selectedDate)
                return !chemoPhase && chemoStartDate && (
                  <div className="text-sm text-muted-foreground">
                    No chemo scheduled for this date
                  </div>
                )
              })()}
            </div>
          )}
        </CardContent>
      </Card>

            {/* Chemo Progress Tracker */}
      <Card id="chemo-progress">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Chemo Progress Tracker
          </CardTitle>
          <CardDescription>
            Track your chemotherapy treatment progress and cycle phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!chemoStartDate ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chemo-start">Start Date</Label>
                  <input
                    id="chemo-start"
                    type="date"
                    value={chemoStartDate}
                    onChange={(e) => setChemoStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycle-length">Cycle Length (days)</Label>
                  <input
                    id="cycle-length"
                    type="number"
                    value={chemoCycleLength}
                    onChange={(e) => setChemoCycleLength(Number(e.target.value))}
                    min="14"
                    max="42"
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-cycles">Total Cycles</Label>
                  <input
                    id="total-cycles"
                    type="number"
                    value={totalCycles}
                    onChange={(e) => setTotalCycles(Number(e.target.value))}
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
              </div>
              <Button 
                onClick={() => setShowChemoTracker(true)}
                disabled={!chemoStartDate}
                className="w-full"
              >
                Start Tracking
              </Button>
            </div>
          ) : (
        <div className="space-y-6">
              {/* Overall Progress */}
              <div className="space-y-3">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {chemoProgress?.completedCycles} of {totalCycles} cycles
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${chemoProgress?.progressPercentage || 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Started: {format(new Date(chemoStartDate), 'MMM d, yyyy')}</span>
                  <span>Day {chemoProgress?.daysSinceStart || 0}</span>
                </div>
              </div>

              {/* Current Cycle Status */}
              {chemoProgress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Current Cycle</span>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        {chemoProgress.completedCycles + 1}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Day {chemoProgress.currentCycleDay} of {chemoCycleLength}
              </div>
            </CardContent>
          </Card>

                  <Card className={`border-2 ${getCyclePhase(chemoProgress.currentCycleDay).border}`}>
                    <CardContent className={`p-4 ${getCyclePhase(chemoProgress.currentCycleDay).bg}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Current Phase</span>
                      </div>
                      <div className={`text-lg font-bold ${getCyclePhase(chemoProgress.currentCycleDay).color}`}>
                        {getCyclePhase(chemoProgress.currentCycleDay).phase}
                        </div>
                      <div className="text-sm text-muted-foreground">
                        {chemoProgress.isOnTreatmentDay && 'Rest and take care'}
                        {chemoProgress.isRecoveryWeek && 'Focus on recovery'}
                        {chemoProgress.isPreparationWeek && 'Prepare for next cycle'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Next Cycle Countdown */}
              {chemoProgress && (
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Next Cycle</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {chemoProgress.completedCycles < totalCycles ? 
                          differenceInDays(chemoProgress.nextCycleDate, new Date()) : 0
                        }
                  </div>
                      <div className="text-sm text-muted-foreground">
                        {chemoProgress.completedCycles < totalCycles ? 
                          'days until next cycle' : 'Treatment complete! 🎉'
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setChemoStartDate('')
                    setShowChemoTracker(false)
                  }}
                >
                  Reset Tracker
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentCycle(Math.min(currentCycle + 1, totalCycles))}
                  disabled={currentCycle >= totalCycles}
                >
                  Mark Cycle Complete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Milestones */}
      <Card id="treatment-milestones">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Treatment Milestones
          </CardTitle>
          <CardDescription>
            Celebrate important milestones in your treatment journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { milestone: 'First Treatment', completed: chemoProgress?.completedCycles > 0, date: chemoStartDate },
              { milestone: 'Halfway Point', completed: chemoProgress?.completedCycles >= Math.ceil(totalCycles / 2), date: chemoStartDate ? addDays(new Date(chemoStartDate), Math.ceil(totalCycles / 2) * chemoCycleLength) : null },
              { milestone: 'Last Treatment', completed: chemoProgress?.completedCycles >= totalCycles, date: chemoStartDate ? addDays(new Date(chemoStartDate), totalCycles * chemoCycleLength) : null },
              { milestone: 'Treatment Complete', completed: chemoProgress?.completedCycles >= totalCycles, date: chemoStartDate ? addDays(new Date(chemoStartDate), totalCycles * chemoCycleLength + 30) : null }
            ].map((milestone, index) => (
              <div key={milestone.milestone} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.completed 
                    ? 'bg-green-100 text-green-600 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{milestone.milestone}</div>
                  {milestone.date && (
                    <div className="text-sm text-muted-foreground">
                      {milestone.completed ? 'Completed' : `Expected: ${format(new Date(milestone.date), 'MMM d, yyyy')}`}
                    </div>
                  )}
                </div>
                {milestone.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    ✓ Done
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Motivation:</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Every milestone is a step closer to recovery. You're doing amazing! 💪
            </p>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Chat Update Tab Content */}
      {activeTab === 'chat' && (
        <>
          {/* Post Update Form - Only for Patients */}
      {canPostUpdates && (
      <Card id="update-composer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Share Your Update
          </CardTitle>
          <CardDescription>
            Let your support circle know how you're doing today
          </CardDescription>
                </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div id="mood-selection" className="space-y-2">
              <Label>How are you feeling today?</Label>
              <RadioGroup value={mood} onValueChange={(value: 'GOOD' | 'OKAY' | 'BAD') => setMood(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GOOD" id="good" />
                  <Label htmlFor="good" className="flex items-center gap-2 cursor-pointer">
                    <Smile className="h-4 w-4 text-green-600" />
                    Good
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OKAY" id="okay" />
                  <Label htmlFor="okay" className="flex items-center gap-2 cursor-pointer">
                    <Meh className="h-4 w-4 text-yellow-600" />
                    Okay
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BAD" id="bad" />
                  <Label htmlFor="bad" className="flex items-center gap-2 cursor-pointer">
                    <Frown className="h-4 w-4 text-red-600" />
                    Bad
                  </Label>
                </div>
              </RadioGroup>
                      </div>

            <div className="space-y-2">
              <Label htmlFor="content">What would you like to share?</Label>
              <Textarea
                id="content"
                placeholder="Share how you're feeling, what you need help with, or any updates..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
                            </div>

            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Posting...' : 'Post Update'}
            </Button>
          </form>
        </CardContent>
      </Card>
      )}

      {/* Caregiver Info */}
      {!canPostUpdates && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Reading Updates</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  As a Caregiver, you can read updates from the patient. Only patients can post updates about their mood and progress.
                </p>
                          </div>
                        </div>
          </CardContent>
        </Card>
      )}


          {/* Group Chat */}
          <GroupChat groupId={session.group.id} />

      {/* Chemo Scheduling Modal */}
      {showScheduleModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Chemo Treatment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduleModal(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium mb-1">Selected Date:</div>
                <div className="text-primary font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="treatment-time">Treatment Time</Label>
                <input
                  id="treatment-time"
                  type="time"
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="treatment-notes">Notes</Label>
                <Textarea
                  id="treatment-notes"
                  placeholder="Any special instructions or notes..."
                  rows={3}
                />
          </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const dateStr = selectedDate.toISOString().split('T')[0]
                    setScheduledDates(prev => [...prev, dateStr])
                    setShowScheduleModal(false)
                  }}
                >
                  Schedule Treatment
            </Button>
          </div>
        </div>
      </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}
