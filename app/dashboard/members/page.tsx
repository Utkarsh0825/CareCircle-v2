'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Users, Plus, User, Copy, Check, Mail, Trash2, AlertTriangle, Heart } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import Link from 'next/link'
import { UserAvatar } from '@/components/user-avatar'

export default function SuperstarsPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [copiedInviteCode, setCopiedInviteCode] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<{id: string, name: string} | null>(null)
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false)
  const [removeConfirmationText, setRemoveConfirmationText] = useState('')

  useEffect(() => {
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  const activeSuperstars = root.members
    .filter(m => m.groupId === session.group!.id && m.status === 'ACTIVE')
    .map(m => ({
      ...m,
      user: root.users[m.userId]
    }))
    .filter(m => m.user)

  // Get user's role in this group
  const userMembership = root.members.find(
    m => m.groupId === session.group!.id && m.userId === session.user!.id && m.status === 'ACTIVE'
  )
  const userRole = userMembership?.role || 'CAREGIVER'
  const isPatient = userRole === 'PATIENT'
  const canManageMembers = isPatient


  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create invite email
    const inviteEmail = {
      id: `invite-${Date.now()}`,
      to: [newMemberEmail],
      subject: `You're invited to join ${session.group!.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">You're invited to join ${session.group!.name}!</h2>
          <p>Hello!</p>
          <p>You've been invited to join the support circle <strong>${session.group!.name}</strong> on CareCircle.</p>
          <p>To join, use this invite code:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; font-family: monospace; font-size: 24px; color: #059669;">${session.group!.inviteCode}</h3>
          </div>
          <p>Visit <a href="http://localhost:3000/auth/join" style="color: #059669;">CareCircle</a> and enter this code to join the circle.</p>
          <p>Best regards,<br>The CareCircle Team</p>
        </div>
      `,
      createdAt: new Date().toISOString()
    }

    // Add to mailbox
    updateRoot(prev => ({
      ...prev,
      mailbox: [...prev.mailbox, inviteEmail]
    }))

    setNewMemberEmail('')
    setShowInviteDialog(false)
    setRoot(getRoot())
  }

  const handleRemoveMember = (memberId: string) => {
    updateRoot(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.userId === memberId && m.groupId === session.group!.id
          ? { ...m, status: 'INACTIVE' }
          : m
      )
    }))
    setRoot(getRoot())
    setMemberToRemove(null)
    setShowRemoveConfirmation(false)
    setRemoveConfirmationText('')
  }

  const initiateRemoveMember = (memberId: string, memberName: string) => {
    setMemberToRemove({ id: memberId, name: memberName })
    setShowRemoveConfirmation(true)
    setRemoveConfirmationText('')
  }

  const confirmRemoveMember = () => {
    if (memberToRemove && removeConfirmationText === 'REMOVE') {
      handleRemoveMember(memberToRemove.id)
    }
  }

  const handleUpdateRole = (memberId: string, newRole: 'CAREGIVER') => {
    updateRoot(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.userId === memberId && m.groupId === session.group!.id
          ? { ...m, role: newRole }
          : m
      )
    }))
    setRoot(getRoot())
  }

  const copyInviteCode = async () => {
    const inviteCode = session.group!.inviteCode
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopiedInviteCode(true)
      setTimeout(() => setCopiedInviteCode(false), 2000)
    } catch (err) {
      console.error('Failed to copy invite code:', err)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'PATIENT': return 'default'
      case 'CAREGIVER': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Superstars</h1>
          <p className="text-muted-foreground">
            Manage your support circle superstars and their roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
          {canManageMembers && (
            <div className="flex gap-2">
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Invite</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSendInvite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="friend@example.com"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        An invite email will be sent to this address with the join code.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invite
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* Superstars List */}
      <Card id="superstars-list">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Circle Superstars
          </CardTitle>
          <CardDescription>
            {activeSuperstars.length} active superstar{activeSuperstars.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeSuperstars.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No superstars yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by sending invites to add superstars to your support circle.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSuperstars.map(member => (
                <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      avatarId={member.user.avatar} 
                      name={member.user.name}
                      size="md"
                    />
                    <div>
                      <div className="font-medium">{member.user.name || 'Unnamed User'}</div>
                      <div className="text-sm text-muted-foreground">{member.user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role === 'PATIENT' && <User className="h-3 w-3 mr-1" />}
                      {member.role === 'CAREGIVER' && <Heart className="h-3 w-3 mr-1" />}
                      {member.role === 'PATIENT' ? 'Patient' : 'Caregiver'}
                    </Badge>
                    
                    {canManageMembers && member.userId !== session.user.id && (
                      <div className="flex gap-2">
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => initiateRemoveMember(member.userId, member.user.name || member.user.email)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Code */}
      <Card id="invite-code-display">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite New Superstars
          </CardTitle>
          <CardDescription>
            Share this invite code with people you want to add to your support circle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={session.group.inviteCode}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyInviteCode}
              className="min-w-[100px]"
            >
              {copiedInviteCode ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            New members can use this code to join your support circle.
          </p>
        </CardContent>
      </Card>

      {/* Double Confirmation Dialog for Member Removal */}
      <AlertDialog open={showRemoveConfirmation} onOpenChange={setShowRemoveConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Remove Member
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from the support circle?
              </p>
              <p className="text-destructive font-medium">
                This action cannot be undone and will remove all their access to the circle.
              </p>
              <div className="space-y-2">
                <Label htmlFor="confirmation-text">
                  Type <strong>REMOVE</strong> to confirm:
                </Label>
                <Input
                  id="confirmation-text"
                  value={removeConfirmationText}
                  onChange={(e) => setRemoveConfirmationText(e.target.value)}
                  placeholder="Type REMOVE here"
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowRemoveConfirmation(false)
                setMemberToRemove(null)
                setRemoveConfirmationText('')
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveMember}
              disabled={removeConfirmationText !== 'REMOVE'}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
