// Local storage shim with SSR fallback
const ROOT_KEY = 'carecircle:v2'
const PREVIOUS_KEYS = ['carecircle:v1', 'carecircle:root', 'carecircle-persistent-session']

// In-memory fallback for SSR
let memoryStore: Map<string, any> | null = null

function getMemoryStore(): Map<string, any> {
  if (!memoryStore) {
    memoryStore = new Map()
  }
  return memoryStore
}

// Data model types
export type Role = 'PATIENT' | 'CAREGIVER'
export type Mood = 'GOOD' | 'OKAY' | 'BAD'
export type TaskStatus = 'OPEN' | 'CLAIMED' | 'COMPLETED' | 'CANCELLED'
export type AlertType = 'BAD_DAY' | 'SCHEDULE_CHANGE' | 'GENERAL'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  age?: number
  cancerType?: string
  treatmentStage?: string
  relationship?: string
  phone?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  inviteCode: string
  createdAt: string
}

export interface GroupMember {
  groupId: string
  userId: string
  role: Role
  status: 'ACTIVE' | 'PENDING' | 'REMOVED'
  joinedAt: string
}

export interface Task {
  id: string
  groupId: string
  title: string
  category: string
  details?: string
  taskDate: string
  startTime?: string
  endTime?: string
  location?: string
  slots: number
  createdBy: string
  createdAt: string
  isRecurring?: boolean
  recurringType?: 'daily' | 'weekly' | 'monthly'
}

export interface TaskSignup {
  taskId: string
  userId: string
  notes?: string
  status: TaskStatus
  claimedAt: string
}

export interface Update {
  id: string
  groupId: string
  authorId?: string
  mood: Mood
  content?: string
  createdAt: string
  visibility: 'members'
}

export interface Donation {
  id: string
  groupId: string
  donorUserId?: string
  amountCents: number
  currency: 'USD'
  status: 'recorded'
  createdAt: string
}

export interface Invite {
  code: string
  groupId: string
  emails?: string[]
  createdAt: string
}

export interface SymptomEntry {
  id: string
  groupId: string
  userId: string
  date: string // YYYY-MM-DD format
  symptoms: {
    nausea: number     // 0-5 scale
    fatigue: number    // 0-5 scale  
    pain: number       // 0-5 scale
    appetite: number   // 0-5 scale
    sleep: number      // 0-5 scale
    mood: number       // 0-5 scale
    energy: number     // 0-5 scale
    hairLoss: number   // 0-5 scale
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  groupId: string
  userId: string
  message: string
  createdAt: string
  type: 'text' | 'system' // system messages for member joins, etc.
}


export interface Mail {
  id: string
  to: string[]
  subject: string
  html: string
  text?: string
  createdAt: string
  meta?: Record<string, any>
}

export interface Root {
  users: Record<string, User>
  groups: Record<string, Group>
  members: GroupMember[]
  tasks: Task[]
  signups: TaskSignup[]
  updates: Update[]
  donations: Donation[]
  invites: Invite[]
  symptoms: SymptomEntry[]
  chatMessages: ChatMessage[]
  mailbox: Mail[]
  session?: {
    userId?: string
    groupId?: string
    lastAlertAt?: string
  }
  meta: {
    seeded: boolean
    version: string
  }
}

// Storage functions
export function get<T>(key: string, fallback: T): T {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${ROOT_KEY}:${key}`)
      return stored ? JSON.parse(stored) : fallback
    } catch {
      return fallback
    }
  } else {
    // SSR fallback
    const store = getMemoryStore()
    return store.has(key) ? store.get(key) : fallback
  }
}

export function set<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${ROOT_KEY}:${key}`, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  } else {
    // SSR fallback
    const store = getMemoryStore()
    store.set(key, value)
  }
}

export function update<T>(key: string, fn: (prev: T) => T, fallback: T): T {
  const current = get(key, fallback)
  const updated = fn(current)
  set(key, updated)
  return updated
}

// Clear previous versions of localStorage
export function clearPreviousVersions(): void {
  if (typeof window !== 'undefined') {
    PREVIOUS_KEYS.forEach(key => {
      localStorage.removeItem(key)
    })
  }
}

// Root data management
export function getRoot(): Root {
  return get('root', {
    users: {},
    groups: {},
    members: [],
    tasks: [],
    signups: [],
    updates: [],
    donations: [],
    invites: [],
    symptoms: [],
    chatMessages: [],
    mailbox: [],
    session: {},
    meta: {
      seeded: false,
      version: '2.0.0'
    }
  })
}

export function setRoot(root: Root): void {
  set('root', root)
}

export function updateRoot(fn: (prev: Root) => Root): Root {
  return update('root', fn, {
    users: {},
    groups: {},
    members: [],
    tasks: [],
    signups: [],
    updates: [],
    donations: [],
    invites: [],
    symptoms: [],
    chatMessages: [],
    mailbox: [],
    session: {},
    meta: {
      seeded: false,
      version: '2.0.0'
    }
  })
}

// Function to assign demo avatars to existing users
export function assignDemoAvatars(): void {
  const root = getRoot()
  
  // Avatar mapping based on names
  const avatarMapping: Record<string, string> = {
    'sarah@example.com': 'female-1',
    'linda@example.com': 'female-2', 
    'emma@example.com': 'female-3',
    'michael@example.com': 'male-1',
    'test@gmail.com': 'male-2',
    'uky.utkarsh0825@gmail.com': 'male-3'
  }
  
  let hasUpdates = false
  const updatedUsers = { ...root.users }
  
  // Update users with avatars based on email
  Object.keys(updatedUsers).forEach(userId => {
    const user = updatedUsers[userId]
    if (user && !user.avatar && avatarMapping[user.email]) {
      updatedUsers[userId] = {
        ...user,
        avatar: avatarMapping[user.email]
      }
      hasUpdates = true
    }
  })
  
  if (hasUpdates) {
    updateRoot(prev => ({
      ...prev,
      users: updatedUsers
    }))
  }
}

// Function to update existing WARRIOR roles to PATIENT and MEMBER to CAREGIVER
export function updatePatientToWarrior(): void {
  const root = getRoot()
  
  let hasUpdates = false
  
  // Migrate old role names
  const updatedMembers = root.members.map(member => {
    if (member.role === 'WARRIOR') {
      hasUpdates = true
      return { ...member, role: 'PATIENT' as const }
    }
    if (member.role === 'MEMBER') {
      hasUpdates = true
      return { ...member, role: 'CAREGIVER' as const }
    }
    if (member.role === 'ADMIN') {
      hasUpdates = true
      return { ...member, role: 'CAREGIVER' as const }
    }
    return member
  })
  
  if (hasUpdates) {
    updateRoot(prev => ({
      ...prev,
      members: updatedMembers
    }))
  }
}

// Seed data function
export function seedIfEmpty(): void {
  const root = getRoot()
  
  // Clear previous versions on first run
  if (!root.meta.seeded || root.meta.version !== '2.0.0') {
    clearPreviousVersions()
  }
  
  if (root.meta.seeded && root.meta.version === '2.0.0') {
    return
  }

  const now = new Date().toISOString()
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()

  // Create demo group
  const demoGroup: Group = {
    id: 'group-1',
    name: 'Care Circle',
    description: 'A supportive community for cancer patients and their loved ones',
    inviteCode: 'CARE-1234',
    createdAt: now
  }

  // Create demo users with avatars based on names
  const demoUsers: Record<string, User> = {
    'user-1': {
      id: 'user-1',
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      age: 42,
      cancerType: 'breast',
      treatmentStage: 'active-treatment',
      avatar: 'female-1' // Classic Female for Sarah
    },
    'user-2': {
      id: 'user-2',
      email: 'linda@example.com',
      name: 'Linda Johnson',
      relationship: 'spouse',
      phone: '(555) 123-4567',
      avatar: 'female-2' // Bold Female for Linda
    },
    'user-3': {
      id: 'user-3',
      email: 'emma@example.com',
      name: 'Emma Wilson',
      relationship: 'friend',
      avatar: 'female-3' // Friendly Female for Emma
    },
    'user-4': {
      id: 'user-4',
      email: 'michael@example.com',
      name: 'Michael Chen',
      relationship: 'family',
      avatar: 'male-1' // Classic Male for Michael
    }
  }

  // Create group members
  const demoMembers: GroupMember[] = [
    {
      groupId: 'group-1',
      userId: 'user-1',
      role: 'PATIENT',
      status: 'ACTIVE',
      joinedAt: now
    },
    {
      groupId: 'group-1',
      userId: 'user-2',
      role: 'CAREGIVER',
      status: 'ACTIVE',
      joinedAt: now
    },
    {
      groupId: 'group-1',
      userId: 'user-3',
      role: 'CAREGIVER',
      status: 'ACTIVE',
      joinedAt: now
    },
    {
      groupId: 'group-1',
      userId: 'user-4',
      role: 'CAREGIVER',
      status: 'ACTIVE',
      joinedAt: now
    }
  ]

  // Create demo tasks
  const demoTasks: Task[] = [
    // Recurring daily tasks
    {
      id: 'recurring-medication',
      groupId: 'group-1',
      title: 'Take morning medication',
      category: 'meds',
      details: 'Take prescribed medication with breakfast',
      taskDate: now.split('T')[0],
      startTime: '08:00',
      endTime: '08:30',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now,
      isRecurring: true,
      recurringType: 'daily'
    },
    {
      id: 'recurring-dog-walk',
      groupId: 'group-1',
      title: 'Dog walk',
      category: 'other',
      details: 'Walk Buddy for 20-30 minutes around the neighborhood',
      taskDate: now.split('T')[0],
      startTime: '07:00',
      endTime: '07:30',
      location: 'Neighborhood',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now,
      isRecurring: true,
      recurringType: 'daily'
    },
    {
      id: 'recurring-evening-meds',
      groupId: 'group-1',
      title: 'Evening medication',
      category: 'meds',
      details: 'Take evening medication with dinner',
      taskDate: now.split('T')[0],
      startTime: '18:30',
      endTime: '19:00',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now,
      isRecurring: true,
      recurringType: 'daily'
    },
    {
      id: 'recurring-daily-routine',
      groupId: 'group-1',
      title: 'Daily routine check-in',
      category: 'other',
      details: 'Help with daily routine activities and check-in',
      taskDate: now.split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now,
      isRecurring: true,
      recurringType: 'daily'
    },
    // Regular one-time tasks
    {
      id: 'task-1',
      groupId: 'group-1',
      title: 'Meal delivery',
      category: 'meal',
      details: 'Please bring dinner around 6 PM',
      taskDate: tomorrow.split('T')[0],
      startTime: '18:00',
      endTime: '19:00',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-2',
      groupId: 'group-1',
      title: 'Ride to doctor appointment',
      category: 'ride',
      details: 'Appointment at 2 PM, need help with transportation',
      taskDate: dayAfter.split('T')[0],
      startTime: '13:30',
      endTime: '15:30',
      location: 'Medical Center',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-3',
      groupId: 'group-1',
      title: 'Laundry help',
      category: 'laundry',
      details: 'Need help with washing and folding clothes',
      taskDate: tomorrow.split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      location: 'Home',
      slots: 2,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-4',
      groupId: 'group-1',
      title: 'Medication pickup',
      category: 'meds',
      details: 'Pick up prescription from pharmacy',
      taskDate: now.split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      location: 'Local Pharmacy',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-5',
      groupId: 'group-1',
      title: 'Visit and chat',
      category: 'visit',
      details: 'Just need some company and conversation',
      taskDate: dayAfter.split('T')[0],
      startTime: '16:00',
      endTime: '17:00',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    }
  ]

  // Create demo updates
  const demoUpdates: Update[] = [
    {
      id: 'update-1',
      groupId: 'group-1',
      authorId: 'user-1',
      mood: 'OKAY',
      content: 'Feeling a bit tired today but managing okay. Thank you everyone for your support.',
      createdAt: now,
      visibility: 'members'
    },
    {
      id: 'update-2',
      groupId: 'group-1',
      authorId: 'user-1',
      mood: 'GOOD',
      content: 'Had a good day today! Energy levels were better and managed to take a short walk.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      visibility: 'members'
    }
  ]

  // Create demo donation
  const demoDonation: Donation = {
    id: 'donation-1',
    groupId: 'group-1',
    donorUserId: 'user-2',
    amountCents: 5000, // $50.00
    currency: 'USD',
    status: 'recorded',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }

  // Create demo invite
  const demoInvite: Invite = {
    code: 'CARE-1234',
    groupId: 'group-1',
    createdAt: now
  }

  // Create demo mail
  const demoMail: Mail = {
    id: 'mail-1',
    to: ['linda@example.com', 'emma@example.com', 'michael@example.com'],
    subject: 'Welcome to Care Circle',
    html: '<p>Welcome to our care circle! We\'re here to support each other.</p>',
    text: 'Welcome to our care circle! We\'re here to support each other.',
    createdAt: now,
    meta: { type: 'welcome' }
  }

  // Create demo symptom entries for the past few days
  const today = new Date()
  const demoSymptoms: SymptomEntry[] = [
    {
      id: 'symptom-1',
      groupId: 'group-1',
      userId: 'user-1', // Sarah (patient)
      date: today.toISOString().split('T')[0],
      symptoms: {
        nausea: 2,
        fatigue: 3,
        pain: 1,
        appetite: 4,
        sleep: 3,
        mood: 4,
        energy: 3,
        hairLoss: 2
      },
      notes: 'Feeling a bit tired today but overall okay',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'symptom-2',
      groupId: 'group-1',
      userId: 'user-1', // Sarah (patient)
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      symptoms: {
        nausea: 1,
        fatigue: 2,
        pain: 0,
        appetite: 5,
        sleep: 4,
        mood: 5,
        energy: 4,
        hairLoss: 2
      },
      notes: 'Had a good day yesterday!',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]


  // Update root with seeded data
  setRoot({
    users: demoUsers,
    groups: { [demoGroup.id]: demoGroup },
    members: demoMembers,
    tasks: demoTasks,
    signups: [],
    updates: demoUpdates,
    donations: [demoDonation],
    invites: [demoInvite],
    symptoms: demoSymptoms,
    chatMessages: [
      {
        id: 'chat-1',
        groupId: 'group-1',
        userId: 'user-2',
        message: 'Hi Sarah! How are you feeling today? 💕',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'text'
      },
      {
        id: 'chat-2',
        groupId: 'group-1',
        userId: 'user-1',
        message: 'Hi Linda! Feeling a bit tired but doing okay. Thanks for checking in! 😊',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: 'text'
      },
      {
        id: 'chat-3',
        groupId: 'group-1',
        userId: 'user-3',
        message: 'Sending lots of love and positive vibes your way! ❤️',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        type: 'text'
      }
    ],
    mailbox: [demoMail],
    session: {},
    meta: {
      seeded: true,
      version: '2.0.0'
    }
  })
}

// Symptom tracking functions
export function addSymptomEntry(entry: Omit<SymptomEntry, 'id' | 'createdAt' | 'updatedAt'>): SymptomEntry {
  const root = getRoot()
  const now = new Date().toISOString()
  
  const newEntry: SymptomEntry = {
    ...entry,
    id: `symptom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now
  }

  updateRoot(prev => ({
    ...prev,
    symptoms: [...(prev.symptoms || []), newEntry]
  }))

  return newEntry
}

export function updateSymptomEntry(entryId: string, updates: Partial<Omit<SymptomEntry, 'id' | 'createdAt'>>): SymptomEntry | null {
  const root = getRoot()
  
  // Ensure symptoms array exists
  if (!root.symptoms) {
    return null
  }
  
  const entryIndex = root.symptoms.findIndex(s => s.id === entryId)
  
  if (entryIndex === -1) {
    return null
  }

  const updatedEntry: SymptomEntry = {
    ...root.symptoms[entryIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  const updatedSymptoms = [...root.symptoms]
  updatedSymptoms[entryIndex] = updatedEntry

  updateRoot(prev => ({
    ...prev,
    symptoms: updatedSymptoms
  }))

  return updatedEntry
}

export function getSymptomsByUser(userId: string, groupId: string): SymptomEntry[] {
  const root = getRoot()
  // Ensure symptoms array exists
  if (!root.symptoms) {
    return []
  }
  return root.symptoms
    .filter(s => s.userId === userId && s.groupId === groupId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getSymptomByDate(userId: string, groupId: string, date: string): SymptomEntry | null {
  const root = getRoot()
  // Ensure symptoms array exists
  if (!root.symptoms) {
    return null
  }
  return root.symptoms.find(s => s.userId === userId && s.groupId === groupId && s.date === date) || null
}

// Chat message functions
export function addChatMessage(message: Omit<ChatMessage, 'id' | 'createdAt'>): ChatMessage {
  const root = getRoot()
  const now = new Date().toISOString()
  
  const newMessage: ChatMessage = {
    ...message,
    id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now
  }

  updateRoot(prev => ({
    ...prev,
    chatMessages: [...(prev.chatMessages || []), newMessage]
  }))

  return newMessage
}

export function getChatMessages(groupId: string): ChatMessage[] {
  const root = getRoot()
  // Ensure chatMessages array exists
  if (!root.chatMessages) {
    return []
  }
  return root.chatMessages
    .filter(m => m.groupId === groupId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function addSystemMessage(groupId: string, message: string): ChatMessage {
  return addChatMessage({
    groupId,
    userId: 'system',
    message,
    type: 'system'
  })
}

// Task helper functions
export function getTasksForDate(groupId: string, targetDate: string): Task[] {
  const root = getRoot()
  if (!root.tasks) return []

  const tasks: Task[] = []
  
  // Get regular tasks for the specific date
  const regularTasks = root.tasks.filter(task => 
    task.groupId === groupId && 
    task.taskDate === targetDate &&
    !task.isRecurring
  )
  
  // Get recurring daily tasks (they appear on every day)
  const recurringTasks = root.tasks.filter(task => 
    task.groupId === groupId && 
    task.isRecurring && 
    task.recurringType === 'daily'
  )
  
  // Create copies of recurring tasks with the target date
  const recurringTasksForDate = recurringTasks.map(task => ({
    ...task,
    taskDate: targetDate,
    id: `${task.id}-${targetDate}` // Unique ID for each date
  }))
  
  return [...regularTasks, ...recurringTasksForDate]
}

export function getAllTasksForGroup(groupId: string): Task[] {
  const root = getRoot()
  if (!root.tasks) return []
  
  return root.tasks.filter(task => task.groupId === groupId)
}

// Migration function to add recurring tasks to existing data
export function migrateToRecurringTasks(): void {
  const root = getRoot()
  
  // Check if we already have recurring tasks
  const hasRecurringTasks = root.tasks.some(task => task.isRecurring)
  
  if (!hasRecurringTasks && root.tasks.length > 0) {
    // Add recurring daily tasks
    const now = new Date().toISOString()
    const today = now.split('T')[0]
    
    const recurringTasks: Task[] = [
      {
        id: 'recurring-medication',
        groupId: 'group-1',
        title: 'Take morning medication',
        category: 'meds',
        details: 'Take prescribed medication with breakfast',
        taskDate: today,
        startTime: '08:00',
        endTime: '08:30',
        location: 'Home',
        slots: 1,
        createdBy: 'user-1',
        createdAt: now,
        isRecurring: true,
        recurringType: 'daily'
      },
      {
        id: 'recurring-dog-walk',
        groupId: 'group-1',
        title: 'Dog walk',
        category: 'other',
        details: 'Walk Buddy for 20-30 minutes around the neighborhood',
        taskDate: today,
        startTime: '07:00',
        endTime: '07:30',
        location: 'Neighborhood',
        slots: 1,
        createdBy: 'user-1',
        createdAt: now,
        isRecurring: true,
        recurringType: 'daily'
      },
      {
        id: 'recurring-evening-meds',
        groupId: 'group-1',
        title: 'Evening medication',
        category: 'meds',
        details: 'Take evening medication with dinner',
        taskDate: today,
        startTime: '18:30',
        endTime: '19:00',
        location: 'Home',
        slots: 1,
        createdBy: 'user-1',
        createdAt: now,
        isRecurring: true,
        recurringType: 'daily'
      },
      {
        id: 'recurring-daily-routine',
        groupId: 'group-1',
        title: 'Daily routine check-in',
        category: 'other',
        details: 'Help with daily routine activities and check-in',
        taskDate: today,
        startTime: '10:00',
        endTime: '11:00',
        location: 'Home',
        slots: 1,
        createdBy: 'user-1',
        createdAt: now,
        isRecurring: true,
        recurringType: 'daily'
      }
    ]
    
    // Add recurring tasks to existing tasks
    const updatedRoot = {
      ...root,
      tasks: [...root.tasks, ...recurringTasks]
    }
    
    setRoot(updatedRoot)
    console.log('✅ Migrated to recurring tasks successfully!')
  }
}


