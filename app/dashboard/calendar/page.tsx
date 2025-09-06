'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, CalendarDays, Clock, MapPin, Users, Plus, Download, HelpCircle, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot, getTasksForDate, migrateToRecurringTasks } from '@/lib/localStore'
import { makeIcs, downloadIcs } from '@/lib/ics'
import { format, addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears, isSameDay, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isToday, isSameMonth, isSameYear } from 'date-fns'
import Link from 'next/link'

const TASK_CATEGORIES = [
  'meal', 'delivery', 'laundry', 'ride', 'visit', 'meds', 'other'
]

export default function CalendarPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [calendarView, setCalendarView] = useState<'week' | 'month' | 'year'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const searchParams = useSearchParams()
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'meal',
    details: '',
    taskDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    location: '',
    slots: 1
  })

  useEffect(() => {
    // Migrate to recurring tasks if needed
    migrateToRecurringTasks()
    
    setSession(getSession())
    setRoot(getRoot())
    
    // Handle URL parameters for filtering
    const filter = searchParams.get('filter')
    const date = searchParams.get('date')
    
    if (filter === 'unclaimed' && date) {
      setSelectedDate(date)
      setCurrentDate(new Date(date))
    }
  }, [searchParams])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  // Get user's role in this group
  const userMembership = root.members.find(
    m => m.groupId === session.group!.id && m.userId === session.user!.id && m.status === 'ACTIVE'
  )
  const userRole = userMembership?.role || 'CAREGIVER'
  const isPatient = userRole === 'PATIENT'
  const canCreateTasks = isPatient

  // Check if we're filtering for unclaimed tasks (from bad day alert)
  const isFilteringUnclaimed = searchParams.get('filter') === 'unclaimed'
  const filterDate = searchParams.get('date')

  const tasks = root.tasks
    .filter(t => t.groupId === session.group!.id)
    .sort((a, b) => new Date(a.taskDate).getTime() - new Date(b.taskDate).getTime())

  const tasksForSelectedDate = tasks.filter(t => t.taskDate === selectedDate)
  
  // Get tasks for selected date (including recurring daily tasks)
  const selectedDateTasks = session.group ? getTasksForDate(session.group.id, selectedDate) : []
  
  // Get today's tasks (for reference)
  const today = new Date().toISOString().split('T')[0]
  const todaysTasks = session.group ? getTasksForDate(session.group.id, today) : []
  
  // Get upcoming tasks (next 7 days and beyond)
  const upcomingTasks = tasks.filter(t => {
    const taskDate = new Date(t.taskDate)
    const todayDate = new Date()
    const nextWeek = addDays(todayDate, 7)
    return taskDate > todayDate && taskDate <= addDays(todayDate, 30) // Next 30 days
  }).sort((a, b) => new Date(a.taskDate).getTime() - new Date(b.taskDate).getTime())

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    
    const task = {
      id: `task-${Date.now()}`,
      groupId: session.group!.id,
      ...newTask,
      createdBy: session.user!.id,
      createdAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }))

    setNewTask({
      title: '',
      category: 'meal',
      details: '',
      taskDate: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      location: '',
      slots: 1
    })
    setShowNewTaskDialog(false)
    setRoot(getRoot())
  }

  const handleClaimTask = (taskId: string) => {
    const task = root.tasks.find(t => t.id === taskId)
    if (!task) return

    const claimedSlots = root.signups
      .filter(s => s.taskId === taskId && s.status === 'CLAIMED')
      .length

    if (claimedSlots >= task.slots) return

    const signup = {
      taskId,
      userId: session.user!.id,
      status: 'CLAIMED' as const,
      claimedAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      signups: [...prev.signups, signup]
    }))

    // Send email notification
    const mail = {
      id: `mail-${Date.now()}`,
      to: [session.user!.email],
      subject: 'Task Claimed Successfully',
      html: `
        <h2>Task Claimed: ${task.title}</h2>
        <p>You have successfully claimed the task "${task.title}" for ${task.taskDate}.</p>
        <p><strong>Details:</strong> ${task.details || 'No additional details'}</p>
        <p><strong>Time:</strong> ${task.startTime ? `${task.startTime}${task.endTime ? ` - ${task.endTime}` : ''}` : 'No time specified'}</p>
        <p><strong>Location:</strong> ${task.location || 'No location specified'}</p>
        <p>Thank you for helping your support circle!</p>
      `,
      createdAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      mailbox: [...prev.mailbox, mail]
    }))

    setRoot(getRoot())
  }

  const handleUnclaimTask = (taskId: string) => {
    updateRoot(prev => ({
      ...prev,
      signups: prev.signups.filter(s => !(s.taskId === taskId && s.userId === session.user!.id))
    }))

          // Send email notification
      const task = root.tasks.find(t => t.id === taskId)
      if (task) {
        const mail = {
          id: `mail-${Date.now()}`,
          to: [session.user!.email],
          subject: 'Task Unclaimed',
          html: `
            <h2>Task Unclaimed: ${task.title}</h2>
            <p>You have unclaimed the task "${task.title}" for ${task.taskDate}.</p>
            <p>If you need to make changes to your schedule, you can always claim it again later.</p>
          `,
          createdAt: new Date().toISOString()
        }

      updateRoot(prev => ({
        ...prev,
        mailbox: [...prev.mailbox, mail]
      }))
    }

    setRoot(getRoot())
  }

const getCategoryIcon = (category: string) => {
  switch (category) {
      case 'meal': return '🍽️'
      case 'delivery': return '📦'
      case 'laundry': return '👕'
      case 'ride': return '🚗'
      case 'visit': return '👥'
      case 'meds': return '💊'
      default: return '📋'
    }
  }

  const isTaskClaimed = (taskId: string) => {
    return root.signups.some(s => s.taskId === taskId && s.userId === session.user!.id && s.status === 'CLAIMED')
  }

  const getAvailableSlots = (taskId: string) => {
    const task = root.tasks.find(t => t.id === taskId)
    if (!task) return 0
    const claimedSlots = root.signups.filter(s => s.taskId === taskId && s.status === 'CLAIMED').length
    return task.slots - claimedSlots
  }

  // Calendar navigation functions
  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (calendarView === 'week') {
      setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1))
    } else if (calendarView === 'month') {
      setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1))
    } else if (calendarView === 'year') {
      setCurrentDate(prev => direction === 'next' ? addYears(prev, 1) : subYears(prev, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const getCalendarTitle = () => {
    if (calendarView === 'week') {
      const start = startOfWeek(currentDate)
      const end = endOfWeek(currentDate)
      if (isSameMonth(start, end)) {
        return format(currentDate, 'MMMM yyyy')
      } else {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      }
    } else if (calendarView === 'month') {
      return format(currentDate, 'MMMM yyyy')
    } else if (calendarView === 'year') {
      return format(currentDate, 'yyyy')
    }
    return ''
  }

  const generateCalendarDays = () => {
    if (calendarView === 'week') {
      const start = startOfWeek(currentDate)
      return eachDayOfInterval({ start, end: endOfWeek(currentDate) })
    } else if (calendarView === 'month') {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const startWeek = startOfWeek(start)
      const endWeek = endOfWeek(end)
      return eachDayOfInterval({ start: startWeek, end: endWeek })
    } else if (calendarView === 'year') {
      const start = startOfYear(currentDate)
      const end = endOfYear(currentDate)
      return eachMonthOfInterval({ start, end })
    }
    return []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage tasks for your support circle
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
          {canCreateTasks && (
            <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
              <DialogTrigger asChild>
                <Button id="create-task-button">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          <span className="mr-2">{getCategoryIcon(category)}</span>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskDate">Date</Label>
                    <Input
                      id="taskDate"
                      type="date"
                      value={newTask.taskDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, taskDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slots">Slots</Label>
                    <Input
                      id="slots"
                      type="number"
                      min="1"
                      value={newTask.slots}
                      onChange={(e) => setNewTask(prev => ({ ...prev, slots: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newTask.endTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newTask.location}
                    onChange={(e) => setNewTask(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    value={newTask.details}
                    onChange={(e) => setNewTask(prev => ({ ...prev, details: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Task</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                    Cancel
                  </Button>
          </div>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>
      </div>

      {/* Caregiver Info */}
      {!canCreateTasks && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Viewing Tasks</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  As a Caregiver, you can view and claim available tasks. Only patients can create new tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bad Day Alert Banner */}
      {isFilteringUnclaimed && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Bad Day Alert:</strong> Someone in your circle is having a difficult day and could use extra support. 
            Please check the unclaimed tasks below and consider helping out.
          </AlertDescription>
        </Alert>
      )}

      {/* Calendar Navigation */}
      <Card id="calendar-navigation">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={calendarView} onValueChange={(value: 'week' | 'month' | 'year') => setCalendarView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
            </Button>
            </div>
          </div>
            </CardHeader>
            <CardContent>
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
                ←
              </Button>
              <h3 className="text-lg font-semibold min-w-[200px] text-center">
                {getCalendarTitle()}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
                →
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {calendarView === 'week' && (
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map(date => {
                  const dateStr = date.toISOString().split('T')[0]
                  const isSelected = dateStr === selectedDate
                  const tasksForThisDate = session.group ? getTasksForDate(session.group.id, dateStr) : []
                  const hasTasks = tasksForThisDate.length > 0
                  const isCurrentDay = isToday(date)
                  
                  return (
                    <Button
                      key={dateStr}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-12 flex flex-col items-center justify-center ${
                        isCurrentDay ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="text-sm font-semibold">{format(date, 'd')}</div>
                      {hasTasks && (
                        <div className="text-xs text-primary">
                          {tasksForThisDate.length > 3 ? '3+' : '●'.repeat(tasksForThisDate.length)}
                        </div>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}

            {calendarView === 'month' && (
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map(date => {
                    const dateStr = date.toISOString().split('T')[0]
                    const isSelected = dateStr === selectedDate
                    const tasksForThisDate = session.group ? getTasksForDate(session.group.id, dateStr) : []
                    const hasTasks = tasksForThisDate.length > 0
                    const isCurrentDay = isToday(date)
                    const isCurrentMonth = isSameMonth(date, currentDate)
                    
                    return (
                      <Button
                        key={dateStr}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-12 flex flex-col items-center justify-center ${
                          isCurrentDay ? 'ring-2 ring-primary' : ''
                        } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                      >
                        <div className="text-sm font-semibold">{format(date, 'd')}</div>
                        {hasTasks && (
                          <div className="text-xs text-primary">
                            {tasksForThisDate.length > 3 ? '3+' : '●'.repeat(tasksForThisDate.length)}
                          </div>
                        )}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {calendarView === 'year' && (
              <div className="grid grid-cols-4 gap-4">
                {generateCalendarDays().map(month => {
                  const monthStr = format(month, 'yyyy-MM')
                  const isCurrentMonth = isSameMonth(month, currentDate)
                  const hasTasks = tasks.some(t => t.taskDate.startsWith(monthStr))
                  
                  return (
                    <Button
                      key={monthStr}
                      variant={isCurrentMonth ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCurrentDate(month)
                        setCalendarView('month')
                      }}
                      className="h-16 flex flex-col items-center justify-center"
                    >
                      <div className="text-sm font-semibold">{format(month, 'MMM')}</div>
                      {hasTasks && (
                        <div className="text-xs text-primary">●</div>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
              </div>
            </CardContent>
          </Card>

            {/* Tasks Overview - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Date Tasks */}
        <Card id="todays-tasks">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {selectedDate === today ? "Today's Tasks" : "Tasks for Selected Date"}
            </CardTitle>
            <CardDescription>
              {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''} for {format(new Date(selectedDate), 'EEEE, MMMM d')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {selectedDate === today ? "No tasks today" : "No tasks for this date"}
                  </h3>
                <p className="text-muted-foreground">
                  {selectedDate === today ? "You're all caught up! 🎉" : "Select another date to view tasks"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateTasks.map(task => {
                  const claimedSlots = root.signups.filter(s => s.taskId === task.id && s.status === 'CLAIMED').length
                  const availableSlots = task.slots - claimedSlots
                  const isClaimed = isTaskClaimed(task.id)

                  return (
                      <Card key={task.id} className="border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Badge variant={availableSlots > 0 ? 'default' : 'secondary'}>
                                  {claimedSlots}/{task.slots} claimed
                                </Badge>
                                {task.isRecurring && (
                                  <Badge variant="outline" className="text-xs">
                                    Daily
                                  </Badge>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                              </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          {task.startTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                              <span>{task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}</span>
                                </div>
                          )}
                          {task.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                              <span>{task.location}</span>
                                </div>
                          )}
                              </div>

                        {task.details && (
                          <p className="text-sm text-muted-foreground">{task.details}</p>
                        )}
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {isClaimed ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUnclaimTask(task.id)}
                                  className="w-auto"
                                >
                                  Unclaim Task
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const icsEvent = {
                                      title: task.title,
                                      start: new Date(`${task.taskDate}T${task.startTime || '00:00'}`),
                                      end: new Date(`${task.taskDate}T${task.endTime || '23:59'}`),
                                      description: task.details,
                                      location: task.location
                                    }
                                    const icsContent = makeIcs(icsEvent)
                                    downloadIcs(icsContent, `${task.title.replace(/\s+/g, '-')}.ics`)
                                  }}
                                  className="w-auto"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download ICS
                                </Button>
                              </>
                            ) : (
                              <Button
                                id="claim-task-example"
                                onClick={() => handleClaimTask(task.id)}
                                disabled={availableSlots === 0}
                                className="w-auto"
                              >
                                Claim Task
                              </Button>
                            )}
                                  </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card id="upcoming-tasks">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              {upcomingTasks.length} task{upcomingTasks.length !== 1 ? 's' : ''} in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming tasks</h3>
                <p className="text-muted-foreground">
                  Create some tasks to get started!
                </p>
                                </div>
                              ) : (
              <div className="space-y-4">
                {upcomingTasks.slice(0, 5).map(task => {
                  const claimedSlots = root.signups.filter(s => s.taskId === task.id && s.status === 'CLAIMED').length
                  const availableSlots = task.slots - claimedSlots
                  const isClaimed = isTaskClaimed(task.id)
                  const taskDate = new Date(task.taskDate)
                  const daysUntil = Math.ceil((taskDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <Card key={task.id} className="border-border/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                            <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                            <div>
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Badge variant={availableSlots > 0 ? 'default' : 'secondary'}>
                                  {claimedSlots}/{task.slots} claimed
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                                  </Badge>
                              </CardDescription>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(taskDate, 'MMM d, yyyy')}</span>
                          </div>
                          {task.startTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}</span>
                                </div>
                              )}
                            </div>

                        {task.location && (
                          <div className="flex items-center gap-1 text-sm mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{task.location}</span>
                          </div>
                        )}

                        {task.details && (
                          <p className="text-sm text-muted-foreground">{task.details}</p>
                        )}
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {isClaimed ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUnclaimTask(task.id)}
                                  className="w-auto"
                                >
                                  Unclaim Task
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const icsEvent = {
                                      title: task.title,
                                      start: new Date(`${task.taskDate}T${task.startTime || '00:00'}`),
                                      end: new Date(`${task.taskDate}T${task.endTime || '23:59'}`),
                                      description: task.details,
                                      location: task.location
                                    }
                                    const icsContent = makeIcs(icsEvent)
                                    downloadIcs(icsContent, `${task.title.replace(/\s+/g, '-')}.ics`)
                                  }}
                                  className="w-auto"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download ICS
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() => handleClaimTask(task.id)}
                                disabled={availableSlots === 0}
                                className="w-auto"
                              >
                                Claim Task
                              </Button>
                            )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  )
                })}
                {upcomingTasks.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      And {upcomingTasks.length - 5} more upcoming tasks...
                    </p>
                  </div>
                )}
                </div>
            )}
              </CardContent>
            </Card>
      </div>
    </div>
  )
}
