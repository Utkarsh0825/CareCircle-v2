'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Settings, Bell, User, Shield, LogOut, Moon, Sun, HelpCircle, Bot } from 'lucide-react'
import { getSession, logout } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { ChatBotToggle } from '@/components/chatbot'
import { AvatarSelector } from '@/components/avatar-selector'
import { UserAvatar } from '@/components/user-avatar'

export default function SettingsPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [userName, setUserName] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedColorScheme, setSelectedColorScheme] = useState('forest-serenity') // Default to green
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const applyColorScheme = useCallback((scheme: string) => {
    localStorage.setItem('carecircle-color-scheme', scheme)
    
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carecircle-color-change'))
    }
  }, [])

  const handleColorSchemeChange = (scheme: string) => {
    setSelectedColorScheme(scheme)
    applyColorScheme(scheme)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const currentSession = getSession()
    const currentRoot = getRoot()
    setSession(currentSession)
    setRoot(currentRoot)
    if (currentSession.user) {
      setUserName(currentSession.user.name || '')
    }
    
    // Load saved color scheme
    const savedScheme = localStorage.getItem('carecircle-color-scheme') || 'forest-serenity'
    setSelectedColorScheme(savedScheme)
  }, [])


  // Handle dark mode changes - let next-themes handle this
  const handleDarkModeChange = (isDark: boolean) => {
    setTheme(isDark ? 'dark' : 'light')
  }

  if (!session.user || !session.group || !mounted) {
    return <div>Loading...</div>
  }

  // Get user's role in this group
  const userMembership = root.members.find(
    m => m.groupId === session.group!.id && m.userId === session.user!.id && m.status === 'ACTIVE'
  )
  const userRole = userMembership?.role || 'CAREGIVER'
  const isPatient = userRole === 'PATIENT'
  const isCaregiver = userRole === 'CAREGIVER'

  const handleLeaveCircle = () => {
    if (confirm('Are you sure you want to leave this care circle? This action cannot be undone.')) {
      // Remove user from the group
      updateRoot(prev => ({
        ...prev,
        members: prev.members.map(m => 
          m.userId === session.user!.id && m.groupId === session.group!.id
            ? { ...m, status: 'REMOVED' }
            : m
        )
      }))
      
      // Clear session and redirect to portal
      logout()
      router.push('/portal')
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      updateRoot(prev => ({
        ...prev,
        users: {
          ...prev.users,
          [session.user!.id]: {
            ...prev.users[session.user!.id],
            name: userName.trim() || undefined
          }
        }
      }))

      setSession(getSession())
      setRoot(getRoot())
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarSelect = (avatarId: string) => {
    updateRoot(prev => ({
      ...prev,
      users: {
        ...prev.users,
        [session.user!.id]: {
          ...prev.users[session.user!.id],
          avatar: avatarId
        }
      }
    }))

    setSession(getSession())
    setRoot(getRoot())
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'PATIENT':
        return 'You are the patient and have full control over the circle'
      case 'CAREGIVER':
        return 'You can view and participate in the circle as a caregiver'
      default:
        return 'Standard caregiver permissions'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and notification preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Profile Settings */}
      <Card id="profile-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={session.user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
              <p className="text-sm text-muted-foreground">
                This name will be displayed to other circle superstars
              </p>
            </div>

            <AvatarSelector
              currentAvatar={session.user.avatar}
              onAvatarSelect={handleAvatarSelect}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card id="appearance-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={mounted && theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light')
                handleDarkModeChange(checked)
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {mounted && theme === 'dark' ? (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark mode is enabled</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span>Light mode is enabled</span>
              </>
            )}
          </div>

          <Separator />

          {/* Color Scheme Selector */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <p className="text-sm text-muted-foreground">
                Choose a color theme that feels right for you
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Forest Serenity (Default) */}
              <button
                onClick={() => handleColorSchemeChange('forest-serenity')}
                className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorScheme === 'forest-serenity' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 ring-2 ring-emerald-200 dark:ring-emerald-800' 
                    : 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-foreground relative z-10">Forest Serenity</span>
                  {selectedColorScheme === 'forest-serenity' && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-500"></div>
                  <div className="w-3 h-3 rounded bg-emerald-400"></div>
                  <div className="w-3 h-3 rounded bg-emerald-300"></div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Warm Sunset */}
              <button
                onClick={() => handleColorSchemeChange('warm-sunset')}
                className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorScheme === 'warm-sunset' 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 ring-2 ring-orange-200 dark:ring-orange-800' 
                    : 'border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-950/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium text-foreground relative z-10">Warm Sunset</span>
                  {selectedColorScheme === 'warm-sunset' && (
                    <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-orange-500"></div>
                  <div className="w-3 h-3 rounded bg-orange-400"></div>
                  <div className="w-3 h-3 rounded bg-orange-300"></div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Ocean Calm */}
              <button
                onClick={() => handleColorSchemeChange('ocean-calm')}
                className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorScheme === 'ocean-calm' 
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950 ring-2 ring-cyan-200 dark:ring-cyan-800' 
                    : 'border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                  <span className="text-sm font-medium text-foreground relative z-10">Ocean Calm</span>
                  {selectedColorScheme === 'ocean-calm' && (
                    <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-cyan-500"></div>
                  <div className="w-3 h-3 rounded bg-cyan-400"></div>
                  <div className="w-3 h-3 rounded bg-cyan-300"></div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Lavender Dreams */}
              <button
                onClick={() => handleColorSchemeChange('lavender-dreams')}
                className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorScheme === 'lavender-dreams' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 ring-2 ring-purple-200 dark:ring-purple-800' 
                    : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium text-foreground relative z-10">Lavender Dreams</span>
                  {selectedColorScheme === 'lavender-dreams' && (
                    <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-purple-500"></div>
                  <div className="w-3 h-3 rounded bg-purple-400"></div>
                  <div className="w-3 h-3 rounded bg-purple-300"></div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>



              {/* Rose Garden */}
              <button
                onClick={() => handleColorSchemeChange('rose-garden')}
                className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorScheme === 'rose-garden' 
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 ring-2 ring-rose-200 dark:ring-rose-800' 
                    : 'border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                  <span className="text-sm font-medium text-foreground relative z-10">Rose Garden</span>
                  {selectedColorScheme === 'rose-garden' && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-rose-500"></div>
                  <div className="w-3 h-3 rounded bg-rose-400"></div>
                  <div className="w-3 h-3 rounded bg-rose-300"></div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Golden Hour */}
              <button
                onClick={() => handleColorSchemeChange('golden-hour')}
                className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColorScheme === 'golden-hour' 
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 ring-2 ring-yellow-200 dark:ring-yellow-800' 
                    : 'border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium text-foreground relative z-10">Golden Hour</span>
                  {selectedColorScheme === 'golden-hour' && (
                    <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded bg-yellow-300"></div>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Each theme creates a different mood:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Warm Sunset:</strong> Energetic and uplifting</li>
                <li><strong>Ocean Calm:</strong> Peaceful and soothing</li>
                <li><strong>Lavender Dreams:</strong> Gentle and nurturing</li>
                <li><strong>Forest Serenity:</strong> Natural and grounding</li>
                <li><strong>Rose Garden:</strong> Warm and caring</li>
                <li><strong>Golden Hour:</strong> Bright and hopeful</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card id="notification-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in the Dev Mailbox
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">You'll receive emails for:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Bad day alerts from circle superstars</li>
              <li>Task claim confirmations</li>
              <li>Slot reopening notifications</li>
              <li>Gift receipts</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant Settings
          </CardTitle>
          <CardDescription>
            Configure CareBot, your AI care companion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChatBotToggle />
          <div className="text-sm text-muted-foreground">
            <p>
              CareBot helps you organize tasks, get support, and navigate your care journey. 
              You can enable or disable it at any time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card id="account-info">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile</Label>
            <div className="flex items-center gap-3">
              <UserAvatar 
                avatarId={session.user.avatar} 
                name={session.user.name}
                size="lg"
              />
              <div>
                <p className="font-medium">{session.user.name || 'No name set'}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Circle</Label>
            <p className="font-medium">{session.group.name}</p>
          </div>

          <div className="space-y-2">
            <Label>Your Role</Label>
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{session.role?.toLowerCase()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getRoleDescription(session.role!)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Superstar Since</Label>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isCaregiver && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Leave Circle</Label>
                <p className="text-sm text-muted-foreground">
                  Remove yourself from this care circle
                </p>
              </div>
              <Button variant="destructive" onClick={handleLeaveCircle}>
                <LogOut className="h-4 w-4 mr-2" />
                Leave Circle
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sign Out</Label>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Information */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">Demo Information</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-200">
          <p className="text-sm mb-2">
            This is a local demo application. All data is stored in your browser's localStorage.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Data persists across browser sessions</li>
            <li>No external services or databases are used</li>
            <li>Emails are simulated in the Dev Mailbox</li>
            <li>Donations are recorded locally only</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
