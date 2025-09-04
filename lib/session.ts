import { getRoot, updateRoot, User, Group, GroupMember } from './localStore'

export interface Session {
  user: User | null
  group: Group | null
  role: 'WARRIOR' | 'MEMBER' | 'ADMIN' | null
}

export interface PersistentSession {
  userId: string
  groupId: string
  rememberMe: boolean
  expiresAt: number
  createdAt: number
}

export function getSession(): Session {
  const root = getRoot()
  const { userId, groupId } = root.session || {}
  
  if (!userId || !groupId) {
    return { user: null, group: null, role: null }
  }

  const user = root.users[userId] || null
  const group = root.groups[groupId] || null
  
  if (!user || !group) {
    return { user: null, group: null, role: null }
  }

  const member = root.members.find(
    m => m.groupId === groupId && m.userId === userId && m.status === 'ACTIVE'
  )

  return {
    user,
    group,
    role: member?.role || null
  }
}

export function getPersistentSession(): PersistentSession | null {
  try {
    const stored = localStorage.getItem('carecircle-persistent-session')
    if (!stored) return null
    
    const session: PersistentSession = JSON.parse(stored)
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      clearPersistentSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error reading persistent session:', error)
    clearPersistentSession()
    return null
  }
}

export function setPersistentSession(userId: string, groupId: string, rememberMe: boolean = false): void {
  const now = Date.now()
  const expiresAt = rememberMe 
    ? now + (365 * 24 * 60 * 60 * 1000) // 1 year
    : now + (24 * 60 * 60 * 1000) // 24 hours
  
  const session: PersistentSession = {
    userId,
    groupId,
    rememberMe,
    expiresAt,
    createdAt: now
  }
  
  localStorage.setItem('carecircle-persistent-session', JSON.stringify(session))
}

export function clearPersistentSession(): void {
  localStorage.removeItem('carecircle-persistent-session')
}

export function autoLogin(): boolean {
  const persistentSession = getPersistentSession()
  if (!persistentSession) return false
  
  const root = getRoot()
  const user = root.users[persistentSession.userId]
  const group = root.groups[persistentSession.groupId]
  
  if (!user || !group) {
    clearPersistentSession()
    return false
  }
  
  // Check if user is still an active member
  const member = root.members.find(
    m => m.groupId === persistentSession.groupId && 
         m.userId === persistentSession.userId && 
         m.status === 'ACTIVE'
  )
  
  if (!member) {
    clearPersistentSession()
    return false
  }
  
  // Restore session
  updateRoot(prev => ({
    ...prev,
    session: {
      userId: persistentSession.userId,
      groupId: persistentSession.groupId
    }
  }))
  
  return true
}

export function requireMember(groupId: string): void {
  const session = getSession()
  if (!session.user || !session.group || session.group.id !== groupId || !session.role) {
    throw new Error('User is not a member of this group')
  }
}

export function login(email: string, rememberMe: boolean = false): User {
  const root = getRoot()
  
  // Find existing user by email
  let user = Object.values(root.users).find(u => u.email === email)
  
  if (!user) {
    // Create new user
    const userId = `user-${Date.now()}`
    user = {
      id: userId,
      email,
      name: email.split('@')[0] // Use email prefix as name
    }
    
    updateRoot(prev => ({
      ...prev,
      users: { ...prev.users, [userId]: user! }
    }))
  }

  // Set session
  updateRoot(prev => ({
    ...prev,
    session: { ...prev.session, userId: user!.id }
  }))

  return user
}

export function loginWithGroup(email: string, groupId: string, rememberMe: boolean = false): User {
  const user = login(email, rememberMe)
  
  // Set persistent session if rememberMe is true
  if (rememberMe) {
    setPersistentSession(user.id, groupId, true)
  }
  
  return user
}

export function selectGroup(groupId: string, rememberMe: boolean = false): void {
  const root = getRoot()
  const { userId } = root.session || {}
  
  if (!userId) {
    throw new Error('User not logged in')
  }

  // Check if user is a member of this group
  const member = root.members.find(
    m => m.groupId === groupId && m.userId === userId && m.status === 'ACTIVE'
  )

  if (!member) {
    throw new Error('User is not a member of this group')
  }

  // Set session group
  updateRoot(prev => ({
    ...prev,
    session: { ...prev.session, groupId }
  }))
  
  // Update persistent session if rememberMe is true
  if (rememberMe) {
    setPersistentSession(userId, groupId, true)
  }
}

export function logout(): void {
  updateRoot(prev => ({
    ...prev,
    session: {}
  }))
  clearPersistentSession()
}

export function getUserGroups(userId: string): Group[] {
  const root = getRoot()
  const userMemberships = root.members.filter(
    m => m.userId === userId && m.status === 'ACTIVE'
  )
  
  return userMemberships.map(membership => root.groups[membership.groupId]).filter(Boolean)
}

export function addMemberToGroup(userId: string, groupId: string, role: 'WARRIOR' | 'MEMBER' | 'ADMIN' = 'MEMBER'): void {
  const root = getRoot()
  
  // Check if membership already exists
  const existingMembership = root.members.find(
    m => m.groupId === groupId && m.userId === userId
  )

  if (existingMembership) {
    // Update existing membership to active
    updateRoot(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.groupId === groupId && m.userId === userId
          ? { ...m, status: 'ACTIVE', role }
          : m
      )
    }))
  } else {
    // Create new membership
    const newMember: GroupMember = {
      groupId,
      userId,
      role,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }))
  }
}

export function removeMemberFromGroup(userId: string, groupId: string): void {
  updateRoot(prev => ({
    ...prev,
    members: prev.members.map(m => 
      m.groupId === groupId && m.userId === userId
        ? { ...m, status: 'REMOVED' }
        : m
    )
  }))
}

export function updateMemberRole(userId: string, groupId: string, role: 'WARRIOR' | 'MEMBER' | 'ADMIN'): void {
  updateRoot(prev => ({
    ...prev,
    members: prev.members.map(m => 
      m.groupId === groupId && m.userId === userId
        ? { ...m, role }
        : m
    )
  }))
}

