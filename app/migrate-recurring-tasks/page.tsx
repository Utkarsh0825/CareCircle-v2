'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Calendar, RefreshCw } from 'lucide-react'
import { migrateToRecurringTasks, getRoot } from '@/lib/localStore'

export default function MigrateRecurringTasksPage() {
  const [migrated, setMigrated] = useState(false)
  const [taskCount, setTaskCount] = useState(0)

  const handleMigration = () => {
    migrateToRecurringTasks()
    const root = getRoot()
    const recurringTasks = root.tasks.filter(task => task.isRecurring)
    setTaskCount(recurringTasks.length)
    setMigrated(true)
  }

  const checkCurrentTasks = () => {
    const root = getRoot()
    const recurringTasks = root.tasks.filter(task => task.isRecurring)
    setTaskCount(recurringTasks.length)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              Migrate to Recurring Tasks
            </CardTitle>
            <CardDescription>
              Add daily recurring tasks (medication, dog walk, daily routine) to your calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button onClick={checkCurrentTasks} variant="outline" className="mb-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Current Tasks
              </Button>
              
              {taskCount > 0 && (
                <Badge variant="default" className="mb-4">
                  {taskCount} recurring tasks found
                </Badge>
              )}
            </div>

            {!migrated ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">This will add 4 daily recurring tasks:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>🌅 Take morning medication (8:00-8:30 AM)</li>
                    <li>🐕 Dog walk (7:00-7:30 AM)</li>
                    <li>🌙 Evening medication (6:30-7:00 PM)</li>
                    <li>✅ Daily routine check-in (10:00-11:00 AM)</li>
                  </ul>
                </div>
                
                <Button onClick={handleMigration} className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Recurring Tasks
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-600">Migration Complete!</h3>
                  <p className="text-muted-foreground">
                    Added {taskCount} recurring daily tasks to your calendar
                  </p>
                </div>
                <Button asChild variant="outline">
                  <a href="/dashboard/calendar">
                    View Calendar
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
