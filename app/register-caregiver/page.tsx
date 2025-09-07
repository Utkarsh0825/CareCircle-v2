'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'

function RegisterCaregiverContent() {
  const [session, setSession] = useState(getSession())
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: session.user?.email || ''
  })
  const [groupInfo, setGroupInfo] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('code')

  useEffect(() => {
    // If user is not signed in, redirect to signin
    if (!session.user) {
      router.push('/auth/signin')
      return
    }

    // If no invite code, redirect to join page
    if (!inviteCode) {
      router.push('/join')
      return
    }

    // Validate invite code and get group info
    const root = getRoot()
    const group = Object.values(root.groups).find(g => g.inviteCode === inviteCode)
    
    if (!group) {
      router.push('/join?error=invalid-code')
      return
    }

    setGroupInfo(group)
  }, [session.user, inviteCode, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !groupInfo) return

    setIsLoading(true)

    try {
      const root = getRoot()
      
      // Update user with additional info
      const updatedUser = {
        ...session.user!,
        name: formData.name.trim()
      }

      // Update root with user info
      updateRoot(prev => ({
        ...prev,
        users: { ...prev.users, [session.user!.id]: updatedUser }
      }))

      // Add user to group as CAREGIVER
      const { addMemberToGroup, selectGroup } = require('@/lib/session')
      addMemberToGroup(session.user!.id, groupInfo.id, 'CAREGIVER')
      selectGroup(groupInfo.id)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to register caregiver:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session.user || !groupInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    )
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
            <CardTitle className="text-2xl">Join as a Caregiver</CardTitle>
            <CardDescription>
              You're joining <strong>{groupInfo.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Circle Information</span>
              </div>
              <p className="text-sm text-primary/80">
                <strong>Circle:</strong> {groupInfo.name}
              </p>
              <p className="text-sm text-primary/80">
                <strong>Invite Code:</strong> {inviteCode}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  <h4 className="text-sm font-medium mb-2">As a Caregiver, you can:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• View and claim tasks to help out</li>
                    <li>• Read updates from the patient</li>
                    <li>• Send gifts and support</li>
                    <li>• Download calendar events for claimed tasks</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading || !formData.name.trim()}>
                    {isLoading ? 'Joining Circle...' : 'Join Circle'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/join">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Link>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterCaregiverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <RegisterCaregiverContent />
    </Suspense>
  )
}
