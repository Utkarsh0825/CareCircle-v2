'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Plus, ArrowRight, User, Shield } from 'lucide-react'
import Link from 'next/link'
import { getSession, getUserGroups } from '@/lib/session'
import { getRoot } from '@/lib/localStore'

export default function PortalPage() {
  const [session, setSession] = useState(getSession())
  const [userGroups, setUserGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!session.user) {
      router.push('/auth/signin')
      return
    }

    const groups = getUserGroups(session.user.id)
    setUserGroups(groups)
    setIsLoading(false)
  }, [session.user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session.user) {
    return null // Will redirect
  }

  const handleSelectGroup = (groupId: string) => {
    const { selectGroup } = require('@/lib/session')
    selectGroup(groupId)
    router.push('/dashboard')
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PATIENT':
        return <Badge variant="default" className="bg-primary">Patient</Badge>
      case 'CAREGIVER':
        return <Badge variant="secondary">Caregiver</Badge>
      case 'ADMIN':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Admin</Badge>
      default:
        return <Badge variant="outline">Member</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PATIENT':
        return <User className="h-4 w-4" />
      case 'CAREGIVER':
        return <Users className="h-4 w-4" />
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  // 0 circles - show create/join options
  if (userGroups.length === 0) {
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
              <CardTitle className="text-2xl">Welcome to CareCircle</CardTitle>
              <CardDescription>
                Create a new care circle as a patient, or join an existing one with an invite code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/register-patient">
                    <User className="h-4 w-4 mr-2" />
                    I'm a Patient
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/join">
                    <Users className="h-4 w-4 mr-2" />
                    I'm a Caregiver
                  </Link>
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p><strong>Patient:</strong> Create your own care circle and invite family and friends to support you.</p>
                <p className="mt-2"><strong>Caregiver:</strong> Join an existing circle with an invite code to help support someone you care about.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 1 circle - auto-route based on role
  if (userGroups.length === 1) {
    const group = userGroups[0]
    const userMembership = getRoot().members.find(
      m => m.groupId === group.id && m.userId === session.user!.id && m.status === 'ACTIVE'
    )
    
    if (userMembership) {
      // Auto-select the group and route to dashboard
      handleSelectGroup(group.id)
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p>Redirecting to your circle...</p>
          </div>
        </div>
      )
    }
  }

  // Multiple circles - show chooser
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
          </Link>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Circle</CardTitle>
            <CardDescription>
              You're a member of {userGroups.length} circle{userGroups.length !== 1 ? 's' : ''}. Select one to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {userGroups.map((group) => {
                const userMembership = getRoot().members.find(
                  m => m.groupId === group.id && m.userId === session.user!.id && m.status === 'ACTIVE'
                )
                
                return (
                  <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(userMembership?.role || 'MEMBER')}
                        {getRoleBadge(userMembership?.role || 'MEMBER')}
                      </div>
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {group.description || 'Care circle'}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleSelectGroup(group.id)}
                      size="sm"
                    >
                      Go
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/create-circle">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Circle
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/join">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Join Another Circle
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
