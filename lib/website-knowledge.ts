// Comprehensive website knowledge base for CareBot
export interface WebsiteFeature {
  name: string
  description: string
  path: string
  category: string
  keywords: string[]
  quickActions?: string[]
}

export interface NavigationAction {
  type: 'navigate' | 'action' | 'info'
  target: string
  label: string
  description: string
}

export const WEBSITE_FEATURES: WebsiteFeature[] = [
  // Authentication & Account
  {
    name: 'Sign In',
    description: 'Login to your CareCircle account',
    path: '/auth/signin',
    category: 'Authentication',
    keywords: ['login', 'sign in', 'log in', 'authenticate', 'access account'],
    quickActions: ['Go to Login', 'Sign In']
  },
  {
    name: 'Sign Up',
    description: 'Create a new CareCircle account',
    path: '/auth/signup',
    category: 'Authentication',
    keywords: ['sign up', 'register', 'create account', 'new user', 'join'],
    quickActions: ['Create Account', 'Sign Up']
  },
  {
    name: 'Join Circle',
    description: 'Join an existing care circle with an invite code',
    path: '/auth/join',
    category: 'Authentication',
    keywords: ['join', 'invite', 'invite code', 'join circle', 'enter code'],
    quickActions: ['Join Circle', 'Enter Invite Code']
  },

  // Dashboard & Main Features
  {
    name: 'Dashboard Home',
    description: 'Main dashboard with overview of tasks, gifts, and circle members',
    path: '/dashboard',
    category: 'Dashboard',
    keywords: ['dashboard', 'home', 'overview', 'main page', 'summary'],
    quickActions: ['Go to Dashboard', 'View Overview']
  },
  {
    name: 'Calendar',
    description: 'Manage chemotherapy schedules, appointments, and important dates',
    path: '/dashboard/calendar',
    category: 'Calendar',
    keywords: ['calendar', 'schedule', 'appointment', 'chemo', 'treatment', 'dates', 'events'],
    quickActions: ['Open Calendar', 'View Schedule', 'Add Appointment']
  },
  {
    name: 'Updates',
    description: 'Share daily mood updates and track treatment progress',
    path: '/dashboard/updates',
    category: 'Updates',
    keywords: ['updates', 'mood', 'progress', 'daily', 'how are you', 'feeling', 'track'],
    quickActions: ['Share Update', 'Track Mood', 'View Progress']
  },
  {
    name: 'Superstars',
    description: 'Manage your support circle members and their roles',
    path: '/dashboard/members',
    category: 'Members',
    keywords: ['superstars', 'members', 'circle', 'support', 'people', 'team', 'manage'],
    quickActions: ['Manage Superstars', 'View Circle', 'Add Member']
  },
  {
    name: 'Settings',
    description: 'Customize your account, appearance, and preferences',
    path: '/dashboard/settings',
    category: 'Settings',
    keywords: ['settings', 'preferences', 'account', 'profile', 'customize', 'configure'],
    quickActions: ['Open Settings', 'Customize App']
  },

  // Gifts & Support
  {
    name: 'Send Gift',
    description: 'Make a financial contribution to support the care circle',
    path: '/donate',
    category: 'Support',
    keywords: ['gift', 'donate', 'contribute', 'support', 'money', 'financial', 'help'],
    quickActions: ['Send Gift', 'Make Donation', 'Support Circle']
  },

  // Additional Features
  {
    name: 'Mood Tracker',
    description: 'Track daily mood and emotional well-being',
    path: '/dashboard/mood-tracker',
    category: 'Health',
    keywords: ['mood', 'tracker', 'emotion', 'wellbeing', 'mental health', 'feeling'],
    quickActions: ['Track Mood', 'Log Emotion']
  },
  {
    name: 'Notifications',
    description: 'View and manage all notifications and alerts',
    path: '/dashboard/notifications',
    category: 'Communication',
    keywords: ['notifications', 'alerts', 'messages', 'updates', 'reminders'],
    quickActions: ['View Notifications', 'Check Alerts']
  },
  {
    name: 'Dev Mailbox',
    description: 'View simulated email notifications (for demo purposes)',
    path: '/dev-mailbox',
    category: 'Demo',
    keywords: ['mailbox', 'emails', 'messages', 'demo', 'simulation'],
    quickActions: ['View Emails', 'Check Mailbox']
  }
]

export const WEBSITE_ACTIONS: Record<string, NavigationAction[]> = {
  // Theme & Appearance
  'change theme': [
    { type: 'navigate', target: '/dashboard/settings', label: 'Open Settings', description: 'Go to settings to change color theme' },
    { type: 'action', target: 'theme-toggle', label: 'Toggle Dark Mode', description: 'Switch between light and dark mode' }
  ],
  'dark mode': [
    { type: 'action', target: 'theme-toggle', label: 'Toggle Dark Mode', description: 'Switch to dark mode' }
  ],
  'light mode': [
    { type: 'action', target: 'theme-toggle', label: 'Toggle Light Mode', description: 'Switch to light mode' }
  ],
  'color scheme': [
    { type: 'navigate', target: '/dashboard/settings', label: 'Change Colors', description: 'Go to settings to select color scheme' }
  ],

  // Calendar & Scheduling
  'add appointment': [
    { type: 'navigate', target: '/dashboard/calendar/new', label: 'Add Appointment', description: 'Create a new calendar event' },
    { type: 'navigate', target: '/dashboard/calendar', label: 'View Calendar', description: 'Open calendar to see existing events' }
  ],
  'schedule chemo': [
    { type: 'navigate', target: '/dashboard/calendar/new', label: 'Schedule Chemo', description: 'Add chemotherapy appointment' }
  ],
  'view calendar': [
    { type: 'navigate', target: '/dashboard/calendar', label: 'Open Calendar', description: 'View your calendar and appointments' }
  ],

  // Updates & Mood
  'share update': [
    { type: 'navigate', target: '/dashboard/updates', label: 'Share Update', description: 'Post a daily update or mood' }
  ],
  'track mood': [
    { type: 'navigate', target: '/dashboard/mood-tracker', label: 'Track Mood', description: 'Log your current mood and emotions' }
  ],
  'how are you': [
    { type: 'navigate', target: '/dashboard/updates', label: 'Share How You Feel', description: 'Let your circle know how you\'re doing' }
  ],

  // Members & Circle
  'add member': [
    { type: 'navigate', target: '/dashboard/members', label: 'Add Superstar', description: 'Invite someone to your support circle' }
  ],
  'manage circle': [
    { type: 'navigate', target: '/dashboard/members', label: 'Manage Superstars', description: 'View and manage your support circle' }
  ],
  'invite someone': [
    { type: 'navigate', target: '/dashboard/members', label: 'Invite Superstar', description: 'Send an invitation to join your circle' }
  ],

  // Support & Gifts
  'send gift': [
    { type: 'navigate', target: '/donate', label: 'Send Gift', description: 'Make a financial contribution' }
  ],
  'support circle': [
    { type: 'navigate', target: '/donate', label: 'Support Circle', description: 'Help support the care circle financially' }
  ],

  // Account & Profile
  'change avatar': [
    { type: 'navigate', target: '/dashboard/settings', label: 'Change Avatar', description: 'Select a new profile picture' }
  ],
  'update profile': [
    { type: 'navigate', target: '/dashboard/settings', label: 'Update Profile', description: 'Edit your account information' }
  ],
  'account settings': [
    { type: 'navigate', target: '/dashboard/settings', label: 'Account Settings', description: 'Manage your account preferences' }
  ],

  // Navigation
  'go home': [
    { type: 'navigate', target: '/dashboard', label: 'Go to Dashboard', description: 'Return to the main dashboard' }
  ],
  'main page': [
    { type: 'navigate', target: '/dashboard', label: 'Go to Dashboard', description: 'Return to the main dashboard' }
  ]
}

export const CONTEXTUAL_HELP: Record<string, string> = {
  '/dashboard': 'You\'re on the main dashboard. I can help you navigate to calendar, updates, superstars, or settings. You can also ask me to add appointments, share updates, or manage your circle.',
  '/dashboard/calendar': 'You\'re viewing your calendar. I can help you add new appointments, schedule chemotherapy sessions, or navigate to other parts of the app.',
  '/dashboard/updates': 'You\'re on the updates page. I can help you share how you\'re feeling, track your mood, or navigate to other features.',
  '/dashboard/members': 'You\'re managing your superstars. I can help you invite new members, change roles, or navigate to other parts of the app.',
  '/dashboard/settings': 'You\'re in settings. I can help you change themes, update your profile, manage notifications, or navigate to other features.',
  '/donate': 'You\'re on the gift page. I can help you make a contribution or navigate to other parts of the app.',
  '/auth/signin': 'You\'re on the login page. I can help you sign in or navigate to sign up if you need to create an account.',
  '/auth/signup': 'You\'re on the sign up page. I can help you create an account or navigate to sign in if you already have one.'
}

export function getContextualHelp(currentPath: string): string {
  return CONTEXTUAL_HELP[currentPath] || 'I can help you navigate the CareCircle app, manage your care schedule, coordinate with your support circle, and customize your experience. What would you like to do?'
}

export function findRelevantFeatures(query: string): WebsiteFeature[] {
  const lowerQuery = query.toLowerCase()
  
  return WEBSITE_FEATURES.filter(feature => 
    feature.keywords.some(keyword => lowerQuery.includes(keyword)) ||
    feature.name.toLowerCase().includes(lowerQuery) ||
    feature.description.toLowerCase().includes(lowerQuery)
  )
}

export function getQuickActions(query: string): NavigationAction[] {
  const lowerQuery = query.toLowerCase()
  
  // Check for exact matches first
  for (const [key, actions] of Object.entries(WEBSITE_ACTIONS)) {
    if (lowerQuery.includes(key)) {
      return actions
    }
  }
  
  // Find relevant features and convert to actions
  const relevantFeatures = findRelevantFeatures(query)
  return relevantFeatures.map(feature => ({
    type: 'navigate' as const,
    target: feature.path,
    label: feature.quickActions?.[0] || feature.name,
    description: feature.description
  }))
}

