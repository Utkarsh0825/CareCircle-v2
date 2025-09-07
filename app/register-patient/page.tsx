'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'

export default function RegisterPatientPage() {
  const [session, setSession] = useState(getSession())
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: session.user?.email || ''
  })
  const router = useRouter()

  useEffect(() => {
    // If user is not signed in, redirect to signin
    if (!session.user) {
      router.push('/auth/signin')
      return
    }
  }, [session.user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.age.trim()) return

    setIsLoading(true)

    try {
      const root = getRoot()
      const now = new Date().toISOString()
      
      // Update user with additional info
      const updatedUser = {
        ...session.user!,
        name: formData.name.trim(),
        age: parseInt(formData.age)
      }

      // Generate unique invite code
      let inviteCode = `CARE-${Math.floor(Math.random() * 9000) + 1000}`
      while (Object.values(root.groups).some(g => g.inviteCode === inviteCode)) {
        inviteCode = `CARE-${Math.floor(Math.random() * 9000) + 1000}`
      }

      // Create new group
      const newGroup = {
        id: `group-${Date.now()}`,
        name: `${formData.name}'s Care Circle`,
        description: `Support circle for ${formData.name}`,
        inviteCode,
        createdAt: now
      }

      // Update root with user and group
      updateRoot(prev => ({
        ...prev,
        users: { ...prev.users, [session.user!.id]: updatedUser },
        groups: { ...prev.groups, [newGroup.id]: newGroup }
      }))

      // Add user as PATIENT member
      const { addMemberToGroup, selectGroup } = require('@/lib/session')
      addMemberToGroup(session.user!.id, newGroup.id, 'PATIENT')
      selectGroup(newGroup.id)

      // Create invite record
      const newInvite = {
        code: inviteCode,
        groupId: newGroup.id,
        createdAt: now
      }

      updateRoot(prev => ({
        ...prev,
        invites: [...prev.invites, newInvite]
      }))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to register patient:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session.user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
          </Link>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Care Circle</CardTitle>
            <CardDescription>
              Tell us about yourself to set up your support network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Sarah Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 45"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  This email is from your sign-in
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">What happens next?</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• You'll get your own private care circle</li>
                    <li>• An invite code will be generated for sharing</li>
                    <li>• Invite family and friends as Caregivers</li>
                    <li>• Start sharing updates and creating tasks</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading || !formData.name.trim() || !formData.age.trim()}>
                    {isLoading ? 'Creating Circle...' : 'Create My Circle'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/auth/signin">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Link>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Are you joining someone's circle?{' '}
            <Link href="/join" className="text-primary hover:underline">
              Use an invite code instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
