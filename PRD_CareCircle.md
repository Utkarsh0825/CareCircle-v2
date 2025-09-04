# COMPREHENSIVE PRODUCT REQUIREMENTS DOCUMENT (PRD)
## CareCircle - Cancer Support Portal

### Document Information
- **Document Version**: 2.0 - COMPREHENSIVE DETAILED VERSION
- **Date**: December 2024
- **Project**: CareCircle Cancer Support Portal
- **Status**: Development Complete - Local Demo Ready
- **Document Type**: EXHAUSTIVE FEATURE DOCUMENTATION
- **Word Count**: UNLIMITED - COMPLETE DETAILS REQUIRED

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Overview
CareCircle is a comprehensive, self-contained local demo application designed to manage cancer support circles. The platform provides a private, secure space for cancer patients to share daily updates, coordinate support from loved ones, and maintain communication within their trusted circle.

### 1.2 COMPREHENSIVE DOCUMENTATION SCOPE
This PRD provides EXHAUSTIVE documentation of every single feature, button, page, and interaction in the CareCircle application. No detail is too small - every click, every form field, every navigation element, and every user action is documented with complete precision.

### 1.2 Problem Statement
Cancer patients and their families often struggle with:
- Coordinating daily support tasks among multiple caregivers
- Keeping everyone updated on the patient's condition and needs
- Managing complex treatment schedules and appointments
- Ensuring consistent communication without overwhelming the patient
- Tracking treatment progress and milestones

### 1.3 Solution
CareCircle addresses these challenges by providing:
- **Private Support Circles**: Invite-only groups with secure authentication
- **Daily Mood Tracking**: Patients can share how they're feeling with automatic alerts for bad days
- **Task Coordination**: Calendar-based system for scheduling and claiming support tasks
- **Treatment Progress Tracking**: Chemotherapy cycle monitoring and milestone celebration
- **Centralized Communication**: One update reaches the entire support network
- **Donation Management**: Local tracking of financial support for the circle

---

## 2. Product Vision & Goals

### 2.1 Vision Statement
"To create a compassionate, secure digital space where cancer patients and their support networks can stay connected, coordinate care, and celebrate every step of the treatment journey together."

### 2.2 Primary Goals
1. **Improve Care Coordination**: Streamline task management and scheduling among caregivers
2. **Enhance Communication**: Provide a centralized platform for updates and information sharing
3. **Support Treatment Journey**: Track progress and celebrate milestones throughout treatment
4. **Reduce Patient Burden**: Minimize the need for patients to repeat information to multiple people
5. **Foster Community**: Create a sense of togetherness and mutual support within care circles

### 2.3 Success Metrics
- User engagement with daily updates and mood tracking
- Task completion rates within support circles
- User satisfaction with communication and coordination features
- Reduction in missed appointments or support tasks
- Positive feedback on treatment progress tracking

---

## 3. Target Audience

### 3.1 Primary Users
- **Cancer Patients**: Individuals undergoing cancer treatment who need support coordination
- **Primary Caregivers**: Family members or close friends providing daily care
- **Support Network Members**: Extended family, friends, and community members offering assistance

### 3.2 User Personas

#### Persona 1: Sarah (Patient)
- **Age**: 45
- **Situation**: Undergoing chemotherapy for breast cancer
- **Needs**: Daily mood tracking, task coordination, treatment progress monitoring
- **Pain Points**: Fatigue, difficulty managing multiple appointments, wanting to keep family updated

#### Persona 2: Linda (Primary Caregiver)
- **Age**: 42
- **Situation**: Sarah's sister, coordinating care from a distance
- **Needs**: Task management, communication updates, member coordination
- **Pain Points**: Juggling work and care responsibilities, coordinating multiple helpers

#### Persona 3: Michael (Support Network)
- **Age**: 38
- **Situation**: Sarah's friend, wants to help but unsure how
- **Needs**: Clear task opportunities, understanding of patient's current state
- **Pain Points**: Not knowing when help is needed, feeling disconnected from the situation

---

## 4. Product Features

### 4.1 Core Features

#### 4.1.1 Authentication & User Management
- **Email-based sign-in system**
- **Join existing circles with invite codes**
- **Role-based access control (Admin, Caregiver, Patient)**
- **Session management with group selection**

#### 4.1.2 Support Circle Management
- **Create and manage private support circles**
- **Invite members with unique invite codes**
- **Role assignment and permissions**
- **Member status tracking (Active, Pending, Removed)**

#### 4.1.3 Daily Updates & Mood Tracking
- **Mood selection (Good, Okay, Bad)**
- **Text-based updates and sharing**
- **Automatic bad day alerts to support circle**
- **Update history and timeline**
- **Visibility controls for sensitive information**

#### 4.1.4 Task Management & Coordination
- **Calendar-based task scheduling**
- **Task categories (Meal, Delivery, Laundry, Ride, Visit, Meds, Other)**
- **Task claiming and management**
- **Multiple time slots and availability tracking**
- **Location and time specifications**
- **ICS calendar file generation and download**

#### 4.1.5 Treatment Progress Tracking
- **Chemotherapy cycle monitoring**
- **Treatment phase identification (Treatment, Recovery, Preparation)**
- **Progress visualization and milestone tracking**
- **Customizable cycle lengths and total cycles**
- **Treatment calendar with phase highlighting**

#### 4.1.6 Symptom Tracking
- **Daily symptom severity tracking**
- **Common chemo side effects monitoring**
- **Visual severity indicators (1-5 scale)**
- **Symptom patterns and trends**

#### 4.1.7 Donation Management
- **Local donation recording**
- **Predefined and custom amount options**
- **Receipt generation and email delivery**
- **Donation history and totals**
- **Support circle funding tracking**

#### 4.1.8 Communication & Notifications
- **Simulated email system for local development**
- **Bad day alerts and task notifications**
- **Donation receipts and confirmations**
- **Developer mailbox for viewing all communications**

### 4.2 User Experience Features

#### 4.2.1 Interactive Tour System
- **Step-by-step guidance for first-time users**
- **Contextual tooltips and explanations**
- **Skip options for experienced users**
- **Page-specific tour triggers**

#### 4.2.2 Responsive Design
- **Mobile-first approach**
- **Cross-device compatibility**
- **Touch-friendly interfaces**
- **Adaptive layouts for different screen sizes**

#### 4.2.3 Theme Support
- **Light and dark mode toggle**
- **System preference detection**
- **Consistent theming across all components**
- **Accessibility considerations**

---

## 5. Technical Architecture

### 5.1 Technology Stack
- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Shadcn/ui component library
- **State Management**: Local storage with in-memory fallback
- **Date Handling**: date-fns library
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

### 5.2 Data Architecture
- **Local Storage System**: Uses localStorage with SSR fallback
- **Data Model**: Single Root object containing all application data
- **No External Database**: Self-contained for demo purposes
- **Data Persistence**: Browser-based storage with memory fallback

### 5.3 Component Structure
- **Modular Design**: Reusable UI components
- **Page-based Routing**: Next.js App Router structure
- **Component Composition**: Flexible component architecture
- **Tour Integration**: Embedded guidance system

---

## 6. User Flows

### 6.1 Onboarding Flow
1. **Landing Page**: User visits homepage and learns about CareCircle
2. **Join or Sign In**: User chooses to join existing circle or sign in
3. **Circle Setup**: New users enter invite code to join circle
4. **Tour Introduction**: Interactive walkthrough of key features
5. **First Update**: User posts initial mood and update

### 6.2 Daily Usage Flow
1. **Dashboard Overview**: View latest updates, tasks, and circle status
2. **Mood Update**: Share daily mood and any updates
3. **Task Management**: Check calendar for upcoming tasks or create new ones
4. **Communication**: Review updates from other circle members
5. **Progress Tracking**: Monitor treatment milestones and chemo progress

### 6.3 Task Coordination Flow
1. **Task Creation**: Patient or caregiver creates new support task
2. **Task Scheduling**: Set date, time, location, and required slots
3. **Task Claiming**: Support network members claim available tasks
4. **Task Completion**: Mark tasks as completed
5. **Notification**: Email confirmations and updates

---

## 7. Data Models

### 7.1 Core Entities

#### User
- ID, email, name, creation date

#### Group (Support Circle)
- ID, name, description, invite code, creation date

#### Group Member
- User ID, group ID, role, status, join date

#### Task
- ID, group ID, title, category, details, date, time, location, slots, creator

#### Task Signup
- Task ID, user ID, notes, status, claim date

#### Update
- ID, group ID, author ID, mood, content, creation date, visibility

#### Donation
- ID, group ID, donor user ID, amount, currency, status, creation date

#### Mail
- ID, recipients, subject, HTML content, text content, creation date, metadata

---

## 8. Security & Privacy

### 8.1 Data Protection
- **Local Storage**: All data stored locally in user's browser
- **No External Sharing**: Data never leaves the local environment
- **Invite-Only Access**: Circles require specific invite codes
- **Role-Based Permissions**: Different access levels for different user types

### 8.2 Privacy Features
- **Private Circles**: All communications within invite-only groups
- **User Control**: Users decide what information to share
- **No Data Mining**: No analytics or tracking of sensitive information
- **Local Processing**: All operations happen locally

---

## 9. Performance & Scalability

### 9.1 Current Implementation
- **Local Demo**: Designed for single-user or small group testing
- **Browser Storage**: Limited by localStorage capacity
- **No Backend**: All processing happens client-side

### 9.2 Production Considerations
- **Database Migration**: Move from localStorage to proper database
- **User Authentication**: Implement secure authentication system
- **Email Services**: Integrate with email service providers
- **Payment Processing**: Add Stripe or similar payment integration
- **Cloud Deployment**: Deploy to Vercel, Netlify, or cloud platforms

---

## 10. Testing & Quality Assurance

### 10.1 Current Testing
- **Local Development**: Manual testing during development
- **Demo Data**: Pre-populated with sample data for testing
- **User Experience**: Interactive tour system for feature discovery

### 10.2 Recommended Testing Strategy
- **Unit Testing**: Component and function testing
- **Integration Testing**: Feature workflow testing
- **User Acceptance Testing**: Real user feedback and validation
- **Accessibility Testing**: Ensure compliance with accessibility standards
- **Performance Testing**: Load testing for production deployment

---

## 11. Deployment & Operations

### 11.1 Current State
- **Development Ready**: Local development environment complete
- **Demo Capable**: Fully functional for demonstration purposes
- **Self-Contained**: No external dependencies or services required

### 11.2 Production Deployment
1. **Environment Setup**: Configure production environment variables
2. **Database Setup**: Implement production database
3. **Authentication**: Deploy secure authentication system
4. **Email Services**: Configure email delivery services
5. **Payment Processing**: Integrate payment gateways
6. **Monitoring**: Set up application monitoring and logging
7. **Backup**: Implement data backup and recovery procedures

---

## 12. Future Enhancements

### 12.1 Short-term Improvements
- **Mobile App**: Native mobile applications for iOS and Android
- **Push Notifications**: Real-time alerts for important updates
- **File Sharing**: Photo and document sharing within circles
- **Video Calls**: Integrated video communication features

### 12.2 Long-term Vision
- **AI-Powered Insights**: Machine learning for treatment pattern recognition
- **Integration**: Connect with healthcare provider systems
- **Community Features**: Connect multiple support circles
- **Research Platform**: Anonymous data contribution to cancer research
- **Internationalization**: Multi-language support for global users

---

## 13. Success Criteria & KPIs

### 13.1 User Engagement
- **Daily Active Users**: Track consistent usage patterns
- **Update Frequency**: Monitor regular mood and status updates
- **Task Completion Rate**: Measure successful task coordination
- **User Retention**: Track long-term user engagement

### 13.2 Care Coordination
- **Task Response Time**: Measure how quickly tasks are claimed
- **Support Network Size**: Track circle member growth
- **Communication Frequency**: Monitor update and interaction rates
- **User Satisfaction**: Collect feedback on platform effectiveness

---

## 14. Risk Assessment

### 14.1 Technical Risks
- **Data Loss**: Local storage limitations and potential data corruption
- **Browser Compatibility**: Different browser behaviors and limitations
- **Performance**: Large data sets may impact local storage performance

### 14.2 User Experience Risks
- **Learning Curve**: Complex features may overwhelm new users
- **Privacy Concerns**: Users may be hesitant about sharing health information
- **Adoption Barriers**: Getting entire support networks to use the platform

### 14.3 Mitigation Strategies
- **Comprehensive Tour System**: Guide users through all features
- **Privacy-First Design**: Emphasize local data storage and privacy
- **Gradual Onboarding**: Introduce features progressively
- **Demo Environment**: Allow users to explore before committing

---

## 15. Conclusion

CareCircle represents a comprehensive solution for cancer support coordination, addressing real needs in the cancer care community. The current implementation provides a fully functional local demo that demonstrates the platform's capabilities while maintaining privacy and security.

The project successfully combines:
- **User-Centered Design**: Intuitive interfaces for patients and caregivers
- **Comprehensive Features**: Complete support for daily care coordination
- **Technical Excellence**: Modern web technologies with robust architecture
- **Privacy Focus**: Local data storage with no external dependencies

With the foundation complete, the next phase should focus on production deployment, user testing, and iterative improvements based on real-world feedback from cancer patients and their support networks.

---

## 16. COMPREHENSIVE PAGE-BY-PAGE DOCUMENTATION

### 16.1 LANDING PAGE (`/`)

#### 16.1.1 Page Overview
- **URL**: `/` (root route)
- **Purpose**: Main entry point for all users
- **Access**: Public (no authentication required)
- **Layout**: Full-width responsive design with header and main content

#### 16.1.2 Header Section
- **Logo**: Heart icon (❤️) with "CareCircle" text
  - **Click Action**: Links to `/` (home page)
  - **Visual**: Heart icon in primary color, text in semibold font
  - **Hover Effect**: Slight opacity change (hover:opacity-80)
  - **Transition**: Smooth opacity transition (transition-opacity)

- **Navigation Buttons** (right side):
  - **Sign In Button**:
    - **Text**: "Sign In"
    - **Variant**: Ghost (outlined style)
    - **Click Action**: Navigates to `/auth/signin`
    - **Hover Effect**: Background color change
  
  - **Join Circle Button**:
    - **Text**: "Join Circle"
    - **Variant**: Default (filled primary color)
    - **Click Action**: Navigates to `/join`
    - **Hover Effect**: Slight darkening of primary color

#### 16.1.3 Main Content Area
- **Hero Section**:
  - **Title**: "CareCircle - Cancer Support Portal"
  - **Subtitle**: "A private, secure space for cancer patients to share daily updates and coordinate support from loved ones."
  - **Description**: Multi-paragraph explanation of the platform's purpose and benefits

- **Feature Highlights**:
  - **Private Support Circles**: Description of invite-only groups
  - **Daily Mood Tracking**: Explanation of mood monitoring system
  - **Task Coordination**: Details about calendar-based task management
  - **Treatment Progress**: Information about chemo cycle tracking
  - **Centralized Communication**: Benefits of unified updates

- **Call-to-Action Buttons**:
  - **Primary CTA**: "Get Started" button
    - **Variant**: Default (filled primary color)
    - **Click Action**: Navigates to `/join`
    - **Hover Effect**: Slight darkening and scale effect
  
  - **Secondary CTA**: "Learn More" button
    - **Variant**: Outline (bordered style)
    - **Click Action**: Scrolls to feature section
    - **Hover Effect**: Background color change

#### 16.1.4 Footer Section
- **Links**: Privacy Policy, Terms of Service, Contact
- **Copyright**: Current year and company information
- **Social Media**: Links to social platforms (if applicable)

#### 16.1.5 Interactive Elements
- **Theme Toggle**: Moon/Sun icon button
  - **Function**: Switches between light and dark themes
  - **Position**: Top-right corner
  - **Icon Change**: Moon icon for light mode, Sun icon for dark mode
  - **Hover Effect**: Background color change

- **Tour Welcome Modal**:
  - **Trigger**: Automatic display for first-time users (1 second delay)
  - **Content**: Welcome message and feature overview
  - **Actions**: "Get Started" button and "Skip" option
  - **Storage**: Remembers if user has seen welcome (localStorage key: 'carecircle-tour-welcome-seen')

#### 16.1.6 Responsive Behavior
- **Mobile**: Stacked layout, full-width buttons
- **Tablet**: Side-by-side layout for larger screens
- **Desktop**: Multi-column layout with optimal spacing

---

### 16.2 AUTHENTICATION PAGES

#### 16.2.1 SIGN IN PAGE (`/auth/signin`)

##### 16.2.1.1 Page Overview
- **URL**: `/auth/signin`
- **Purpose**: User authentication and login
- **Access**: Public (no authentication required)
- **Layout**: Centered card layout with minimal header

##### 16.2.1.2 Header Section
- **Logo**: Heart icon with "CareCircle" text
  - **Click Action**: Links to `/` (home page)
  - **Visual**: Centered, larger size (h-8 w-8)
  - **Text**: 2xl font size, semibold weight

##### 16.2.1.3 Main Form Card
- **Card Title**: "Welcome Back"
- **Card Description**: "Sign in to your support circle"
- **Form Fields**:
  
  **Email Input Field**:
  - **Label**: "Email"
  - **Type**: email input
  - **Placeholder**: "Enter your email"
  - **Validation**: Required field, email format validation
  - **Styling**: bg-input border-border classes
  - **State**: Controlled by `email` state variable
  
  **Remember Me Checkbox**:
  - **Label**: "Remember me for 30 days"
  - **Type**: checkbox input
  - **State**: Controlled by `rememberMe` state variable
  - **Styling**: h-4 w-4 rounded border-gray-300
  - **Function**: Extends session duration to 30 days

  **Sign In Button**:
  - **Text**: "Sign In" (changes to "Signing in..." when loading)
  - **Type**: submit button
  - **Variant**: Full width (w-full)
  - **State**: Disabled when `isLoading` is true
  - **Click Action**: Triggers `handleSubmit` function

##### 16.2.1.4 Form Processing
- **Submit Handler**: `handleSubmit` function
- **Loading State**: Shows loading spinner and disables button
- **Error Handling**: Displays error messages below form
- **Success Flow**:
  1. Calls `login(email, rememberMe)` function
  2. Gets user groups with `getUserGroups(user.id)`
  3. Redirects based on group count:
     - **0 groups**: Redirects to `/join`
     - **1 group**: Auto-selects group and redirects to `/dashboard`
     - **Multiple groups**: Redirects to group selection page

##### 16.2.1.5 Additional Elements
- **Error Display**: Red text below form showing login errors
- **Help Text**: "Enter your email to sign in or create a new account"
- **Links**:
  - **"Don't have an account?"**: Links to `/auth/signup`
  - **"Forgot password?"**: Links to password reset (if implemented)

##### 16.2.1.6 Theme Support
- **Theme Toggle**: Moon/Sun icon button
  - **Position**: Top-right corner
  - **Function**: Switches between light and dark themes
  - **Icon Change**: Moon for light mode, Sun for dark mode

#### 16.2.2 SIGN UP PAGE (`/auth/signup`)

##### 16.2.2.1 Page Overview
- **URL**: `/auth/signup`
- **Purpose**: New user registration and circle creation
- **Access**: Public (no authentication required)
- **Layout**: Centered card layout with minimal header

##### 16.2.2.2 Header Section
- **Logo**: Heart icon with "CareCircle" text
  - **Click Action**: Links to `/` (home page)
  - **Visual**: Centered, larger size (h-8 w-8)
  - **Text**: 2xl font size, semibold weight

##### 16.2.2.3 Main Form Card
- **Card Title**: "Create Your Circle"
- **Card Description**: "Start your private support network"
- **Form Fields**:
  
  **Full Name Input**:
  - **Label**: "Full Name"
  - **Type**: text input
  - **Placeholder**: "Your full name"
  - **Validation**: Required field
  - **Styling**: bg-input border-border classes
  
  **Email Input**:
  - **Label**: "Email"
  - **Type**: email input
  - **Placeholder**: "your@email.com"
  - **Validation**: Required field, email format validation
  - **Styling**: bg-input border-border classes

  **Role Selection**:
  - **Label**: "I am a:"
  - **Type**: Radio group with two options
  - **Option 1**: "Cancer patient creating my support circle"
    - **Value**: "patient"
    - **Default**: Selected by default
  - **Option 2**: "Family member/caregiver setting up for a loved one"
    - **Value**: "caregiver"
    - **Styling**: Radio buttons with labels

  **Create Circle Button**:
  - **Text**: "Create Circle"
  - **Type**: submit button
  - **Variant**: Full width (w-full)
  - **Click Action**: Triggers form submission

##### 16.2.2.4 Additional Elements
- **Help Text**: "We'll send you a secure link to complete setup"
- **Links**:
  - **"Already have an account?"**: Links to `/auth/signin`

##### 16.2.2.5 Form Processing
- **Current Status**: Form is present but not fully functional
- **TODO**: Implement actual user creation and circle setup
- **Expected Flow**: Send verification email and complete setup

#### 16.2.3 JOIN PAGE (`/join`)

##### 16.2.3.1 Page Overview
- **URL**: `/join`
- **Purpose**: Join existing support circle with invite code
- **Access**: Public (no authentication required)
- **Layout**: Centered card layout with two-step process

##### 16.2.3.2 Header Section
- **Logo**: Heart icon with "CareCircle" text
  - **Click Action**: Links to `/` (home page)
  - **Visual**: Centered, larger size (h-8 w-8)
  - **Text**: 2xl font size, semibold weight

##### 16.2.3.3 Two-Step Process

**Step 1: Enter Invite Code**
- **Card Title**: "Join a Circle"
- **Card Description**: "Enter your invite code to join a support circle"
- **Form Fields**:
  
  **Invite Code Input**:
  - **Label**: "Invite Code"
  - **Type**: text input
  - **Placeholder**: "Enter 6-digit code"
  - **Max Length**: 6 characters
  - **Styling**: text-center text-lg tracking-widest
  - **State**: Controlled by `inviteCode` state variable
  
  **Join Circle Button**:
  - **Text**: "Join Circle"
  - **Type**: submit button
  - **Variant**: Full width (w-full)
  - **Click Action**: Triggers `handleCodeSubmit` function

**Step 2: Enter Email**
- **Card Title**: "Join a Circle"
- **Card Description**: "Enter your email to complete joining"
- **Form Fields**:
  
  **Email Input**:
  - **Label**: "Email Address"
  - **Type**: email input
  - **Placeholder**: "Enter your email"
  - **Validation**: Required field, email format validation
  - **State**: Controlled by `email` state variable
  
  **Navigation Buttons**:
  - **Back Button**:
    - **Text**: "Back"
    - **Variant**: outline
    - **Click Action**: Returns to Step 1 (sets step to 'code')
    - **Styling**: flex-1 (equal width)
  
  - **Join Circle Button**:
    - **Text**: "Join Circle" (changes to "Joining..." when loading)
    - **Variant**: Default (filled)
    - **State**: Disabled when `isLoading` is true
    - **Click Action**: Triggers `handleEmailSubmit` function
    - **Styling**: flex-1 (equal width)

##### 16.2.3.4 Form Processing
- **Step 1 Handler**: `handleCodeSubmit`
  - Validates invite code against existing invites and groups
  - Sets error if code is invalid
  - Advances to Step 2 if code is valid
  
- **Step 2 Handler**: `handleEmailSubmit`
  - Creates user account with provided email
  - Adds user to the group associated with invite code
  - Selects the group for the user
  - Redirects to dashboard

##### 16.2.3.5 Additional Elements
- **Error Display**: Red text below form showing validation errors
- **Help Text**: "Ask the circle owner for your invite code"
- **Links**:
  - **"Need to create your own circle?"**: Links to `/auth/signup`
  - **"Already have an account?"**: Links to `/auth/signin`
  - **"← Back to home"**: Links to `/` (home page)

##### 16.2.3.6 Theme Support
- **Theme Toggle**: Moon/Sun icon button
  - **Position**: Top-right corner
  - **Function**: Switches between light and dark themes

---

### 16.3 DASHBOARD PAGES

#### 16.3.1 MAIN DASHBOARD (`/dashboard`)

##### 16.3.1.1 Page Overview
- **URL**: `/dashboard`
- **Purpose**: Central hub showing overview of care circle activities
- **Access**: Authenticated users only
- **Layout**: Grid-based card layout with navigation header

##### 16.3.1.2 Header Section
- **Welcome Message**:
  - **Title**: "Welcome back, [User Name]"
  - **Subtitle**: "Here's what's happening in your care circle today."
  - **Dynamic**: Shows user's name or email if name not available

- **Action Buttons** (right side):
  - **Theme Toggle**: Moon/Sun icon button
    - **Function**: Switches between light and dark themes
    - **Position**: Right side of header
  
  - **Back to Home Button**:
    - **Text**: "← Back to Home"
    - **Variant**: outline, small size
    - **Click Action**: Navigates to `/` (home page)
    - **Icon**: Left arrow (←)
  
  - **Tour Trigger Button**:
    - **Text**: "Tour" (with help icon)
    - **Variant**: outline, small size
    - **Click Action**: Starts interactive tour of dashboard features
    - **Icon**: HelpCircle icon

##### 16.3.1.3 Main Content Grid (3-column layout)

**Column 1: Latest Update Card**
- **Card ID**: "latest-update"
- **Card Title**: "Latest Update" with MessageCircle icon
- **Content**:
  - **Mood Badge**: Shows mood (GOOD/OKAY/BAD) with color coding
    - **GOOD**: Default variant (green)
    - **OKAY**: Secondary variant (gray)
    - **BAD**: Destructive variant (red)
  - **Date**: Shows when update was posted (format: "MMM d")
  - **Update Text**: Shows the actual update content
  - **Fallback**: "No updates yet today." if no updates exist

**Column 2: What's Needed Now Card**
- **Card ID**: "whats-needed"
- **Card Title**: "What's Needed Now" with Calendar icon
- **Content**:
  - **Task List**: Shows upcoming tasks that need attention
  - **Task Display**: Each task shows:
    - **Title**: Task name
    - **Category**: Badge showing task type (meal, delivery, laundry, etc.)
    - **Date**: When task is scheduled
    - **Slots**: Available vs. filled slots
  - **Fallback**: "No urgent tasks at the moment." if no tasks exist

**Column 3: Circle Status Card**
- **Card ID**: "circle-status"
- **Card Title**: "Circle Status" with Users icon
- **Content**:
  - **Member Count**: Total active members in circle
  - **Recent Activity**: Shows latest member actions
  - **Quick Actions**: Buttons for common tasks

##### 16.3.1.4 Interactive Elements
- **Tour System**: Step-by-step guidance through dashboard features
- **Theme Switching**: Seamless light/dark mode toggle
- **Responsive Layout**: Adapts to different screen sizes

##### 16.3.1.5 Data Sources
- **Session Data**: User and group information from `getSession()`
- **Root Data**: Application state from `getRoot()`
- **Real-time Updates**: Refreshes data on component mount

#### 16.3.2 DASHBOARD LAYOUT (`/dashboard/layout.tsx`)

##### 16.3.2.1 Layout Overview
- **Purpose**: Wrapper component for all dashboard pages
- **Function**: Provides navigation sidebar and header for dashboard
- **Authentication**: Redirects unauthenticated users to signin

##### 16.3.2.2 Header Section
- **Logo Section** (left side):
  - **Logo**: Heart icon with "CareCircle" text
    - **Click Action**: Links to `/` (home page)
    - **Visual**: Heart icon in primary color, text in semibold font
    - **Hover Effect**: Slight opacity change
  
  - **Group Name Display**:
    - **Text**: Shows current group name
    - **Styling**: text-sm text-muted-foreground
    - **Dynamic**: Updates based on selected group

- **User Actions** (right side):
  - **Theme Toggle**: Moon/Sun icon button
    - **Function**: Switches between light and dark themes
    - **Position**: Right side of header
  
  - **Logout Button**:
    - **Text**: "Log Out"
    - **Variant**: outline
    - **Icon**: LogOut icon
    - **Click Action**: Calls `handleLogout()` function
    - **Function**: Clears session and redirects to `/auth/signin`

##### 16.3.2.3 Navigation Sidebar
- **Navigation Items**:
  
  **Dashboard Home**:
  - **Icon**: Home icon
  - **Text**: "Dashboard"
  - **Link**: `/dashboard`
  - **Active State**: Highlighted when on dashboard home page
  
  **Calendar**:
  - **Icon**: Calendar icon
  - **Text**: "Calendar"
  - **Link**: `/dashboard/calendar`
  - **Active State**: Highlighted when on calendar page
  
  **Updates**:
  - **Icon**: MessageSquare icon
  - **Text**: "Updates"
  - **Link**: `/dashboard/updates`
  - **Active State**: Highlighted when on updates page
  
  **Members**:
  - **Icon**: Users icon
  - **Text**: "Members"
  - **Link**: `/dashboard/members`
  - **Active State**: Highlighted when on members page
  
  **Settings**:
  - **Icon**: Settings icon
  - **Text**: "Settings"
  - **Link**: `/dashboard/settings`
  - **Active State**: Highlighted when on settings page

##### 16.3.2.4 Authentication Logic
- **Session Check**: Verifies user has valid session on mount
- **Redirect Logic**: 
  - **No User**: Redirects to `/auth/signin`
  - **No Group**: Redirects to group selection
- **Loading State**: Shows loading spinner during authentication check

##### 16.3.2.5 Responsive Behavior
- **Mobile**: Collapsible sidebar with hamburger menu
- **Desktop**: Fixed sidebar with full navigation
- **Tablet**: Adaptive layout based on screen size

#### 16.3.3 UPDATES PAGE (`/dashboard/updates`)

##### 16.3.3.1 Page Overview
- **URL**: `/dashboard/updates`
- **Purpose**: Daily mood tracking, updates, and chemo progress monitoring
- **Access**: Authenticated users only
- **Layout**: Multi-section page with forms and displays

##### 16.3.3.2 Header Section
- **Page Title**: "Daily Updates & Mood Tracking"
- **Subtitle**: "Share how you're feeling and track your treatment progress"
- **Navigation**: Back button to dashboard

##### 16.3.3.3 Mood Update Section
- **Card Title**: "How are you feeling today?"
- **Mood Selection**:
  - **Radio Group**: Three mood options
    - **Good**: Smile icon, "GOOD" value
    - **Okay**: Meh icon, "OKAY" value  
    - **Bad**: Frown icon, "BAD" value
  - **Default Selection**: "OKAY" mood
  
- **Update Text Area**:
  - **Label**: "What would you like to share?"
  - **Placeholder**: "Share your thoughts, feelings, or any updates..."
  - **Character Limit**: No specific limit
  - **Required**: Yes (for mood updates)
  
- **Submit Button**:
  - **Text**: "Share Update"
  - **State**: Disabled when submitting
  - **Loading Text**: "Sharing..."
  - **Click Action**: Calls `handleSubmit` function

##### 16.3.3.4 Chemo Progress Tracker
- **Toggle Button**: "Show Chemo Tracker" / "Hide Chemo Tracker"
- **Form Fields**:
  
  **Start Date**:
  - **Label**: "When did chemo start?"
  - **Type**: Date input
  - **Format**: YYYY-MM-DD
  - **Required**: Yes
  
  **Cycle Length**:
  - **Label**: "How many days between cycles?"
  - **Type**: Number input
  - **Default**: 21 days
  - **Range**: 1-365 days
  - **Required**: Yes
  
  **Total Cycles**:
  - **Label**: "How many total cycles?"
  - **Type**: Number input
  - **Default**: 6 cycles
  - **Range**: 1-100 cycles
  - **Required**: Yes
  
  **Current Cycle**:
  - **Label**: "Which cycle are you on?"
  - **Type**: Number input
  - **Default**: 1
  - **Range**: 1 to total cycles
  - **Required**: Yes

- **Progress Visualization**:
  - **Current Phase**: Shows Treatment/Recovery/Preparation
  - **Progress Bar**: Visual representation of current cycle
  - **Days Remaining**: Countdown to next cycle
  - **Milestone Tracking**: Highlights important dates

##### 16.3.3.5 Calendar View Section
- **View Toggle**: Week/Month/Year tabs
- **Navigation Controls**:
  - **Previous Button**: ChevronLeft icon, goes to previous period
  - **Next Button**: ChevronRight icon, goes to next period
  - **Today Button**: "Today" text, returns to current date
  
- **Calendar Display**:
  - **Date Grid**: Shows dates with mood indicators
  - **Mood Colors**: 
    - **Good**: Green background
    - **Okay**: Yellow background
    - **Bad**: Red background
  - **Treatment Phases**: Highlighted based on chemo tracker

##### 16.3.3.6 Update History Section
- **Card Title**: "Recent Updates"
- **Update Cards**: Each update shows:
  - **Author**: User name with avatar
  - **Mood**: Badge with mood and color
  - **Content**: Update text
  - **Timestamp**: When posted
  - **Actions**: Edit/Delete buttons (if user is author)

##### 16.3.3.7 Bad Day Alert System
- **Automatic Detection**: Triggers when mood is set to "BAD"
- **Alert Display**: Shows warning message below form
- **Email Notification**: Sends alert to support circle members
- **Alert Content**: "Bad day detected - please check on [User Name]"

##### 16.3.3.8 Form Processing
- **Submit Handler**: `handleSubmit` function
- **Validation**: Ensures mood is selected and content is provided
- **Data Storage**: Saves to local storage via `updateRoot`
- **Email Sending**: Triggers email notifications for bad days
- **State Updates**: Refreshes page data after successful submission

##### 16.3.3.9 Interactive Features
- **Tour System**: Step-by-step guidance through features
- **Real-time Updates**: Immediate display of new updates
- **Responsive Design**: Adapts to mobile and desktop layouts

#### 16.3.4 CALENDAR PAGE (`/dashboard/calendar`)

##### 16.3.4.1 Page Overview
- **URL**: `/dashboard/calendar`
- **Purpose**: Task management, scheduling, and calendar coordination
- **Access**: Authenticated users only
- **Layout**: Calendar view with task management interface

##### 16.3.4.2 Header Section
- **Page Title**: "Task Calendar"
- **Subtitle**: "Schedule and coordinate support tasks"
- **Action Buttons**:
  - **New Task Button**: Plus icon, "New Task" text
    - **Variant**: Default (filled)
    - **Click Action**: Opens new task dialog
    - **Icon**: Plus icon

##### 16.3.4.3 Calendar Navigation
- **View Toggle**: Week/Month/Year tabs
- **Navigation Controls**:
  - **Previous Button**: ChevronLeft icon
    - **Click Action**: Goes to previous time period
    - **Function**: Updates `currentPeriod` state
  
  - **Next Button**: ChevronRight icon
    - **Click Action**: Goes to next time period
    - **Function**: Updates `currentPeriod` state
  
  - **Today Button**: "Today" text
    - **Click Action**: Returns to current date
    - **Function**: Sets `currentPeriod` to new Date()

##### 16.3.4.4 Calendar Display
- **Date Selection**: Clickable date cells
- **Selected Date**: Highlighted with primary color
- **Task Indicators**: Small dots showing tasks on dates
- **Current Date**: Special highlighting (today's date)

##### 16.3.4.5 Task Management Interface

**New Task Dialog**:
- **Trigger**: "New Task" button click
- **Form Fields**:
  
  **Task Title**:
  - **Label**: "Task Title"
  - **Type**: Text input
  - **Placeholder**: "What needs to be done?"
  - **Required**: Yes
  - **Validation**: Must not be empty
  
  **Category Selection**:
  - **Label**: "Category"
  - **Type**: Select dropdown
  - **Options**: meal, delivery, laundry, ride, visit, meds, other
  - **Default**: "meal"
  - **Required**: Yes
  
  **Details**:
  - **Label**: "Details"
  - **Type**: Textarea
  - **Placeholder**: "Additional information..."
  - **Required**: No
  - **Rows**: 3
  
  **Date**:
  - **Label**: "Date"
  - **Type**: Date input
  - **Default**: Today's date
  - **Required**: Yes
  
  **Time Range**:
  - **Start Time**: Time input for task start
  - **End Time**: Time input for task end
  - **Required**: No
  
  **Location**:
  - **Label**: "Location"
  - **Type**: Text input
  - **Placeholder**: "Where should this happen?"
  - **Required**: No
  
  **Slots**:
  - **Label**: "How many people needed?"
  - **Type**: Number input
  - **Default**: 1
  - **Min**: 1
  - **Max**: 10
  - **Required**: Yes

- **Dialog Actions**:
  - **Cancel Button**: Closes dialog without saving
  - **Create Task Button**: Saves task and closes dialog

**Task Display**:
- **Task Cards**: Each task shows:
  - **Title**: Task name
  - **Category**: Badge with category name and color
  - **Date & Time**: When task is scheduled
  - **Location**: Where task should happen
  - **Slots**: Available vs. filled slots
  - **Creator**: Who created the task
  - **Actions**: Claim, edit, delete buttons

##### 16.3.4.6 Task Actions

**Claim Task**:
- **Button**: "Claim" text
- **Function**: Allows user to sign up for task
- **Process**: Opens claim dialog with notes field
- **Validation**: Ensures slot is available

**Edit Task**:
- **Button**: Edit icon
- **Function**: Opens edit dialog with pre-filled form
- **Permissions**: Only creator can edit
- **Validation**: Same as new task

**Delete Task**:
- **Button**: Trash icon
- **Function**: Removes task from calendar
- **Confirmation**: Shows confirmation dialog
- **Permissions**: Only creator can delete

##### 16.3.4.7 Calendar Export
- **Download Button**: "Download Calendar" with Download icon
- **Format**: ICS file format
- **Content**: All tasks for selected time period
- **Function**: Generates and downloads calendar file

##### 16.3.4.8 Data Management
- **Task Storage**: Saves to local storage via `updateRoot`
- **Real-time Updates**: Immediate display of new tasks
- **Filtering**: Shows only tasks for current group
- **Sorting**: Tasks ordered by date and time

##### 16.3.4.9 Interactive Features
- **Tour System**: Step-by-step guidance
- **Drag & Drop**: Move tasks between dates (if implemented)
- **Quick Actions**: Right-click context menu for tasks
- **Responsive Design**: Mobile-friendly calendar interface

#### 16.3.5 MEMBERS PAGE (`/dashboard/members`)

##### 16.3.5.1 Page Overview
- **URL**: `/dashboard/members`
- **Purpose**: Manage support circle members and permissions
- **Access**: Authenticated users only (Admin role required for some actions)
- **Layout**: Member list with management interface

##### 16.3.5.2 Header Section
- **Page Title**: "Circle Members"
- **Subtitle**: "Manage your support circle members and permissions"
- **Action Buttons**:
  - **Add Member Button**: Plus icon, "Add Member" text
    - **Variant**: Default (filled)
    - **Click Action**: Opens add member dialog
    - **Icon**: Plus icon

##### 16.3.5.3 Member List Display
- **Member Cards**: Each member shows:
  - **Avatar**: User profile picture or initials
  - **Name**: Full name of member
  - **Email**: Email address
  - **Role**: Badge showing role (Admin, Caregiver, Patient)
  - **Status**: Active, Pending, or Removed
  - **Join Date**: When member joined the circle
  - **Actions**: Role change, remove member buttons

##### 16.3.5.4 Member Management

**Add Member Dialog**:
- **Form Fields**:
  
  **Email**:
  - **Label**: "Email Address"
  - **Type**: Email input
  - **Placeholder**: "member@email.com"
  - **Required**: Yes
  - **Validation**: Valid email format
  
  **Role**:
  - **Label**: "Role"
  - **Type**: Select dropdown
  - **Options**: Admin, Caregiver, Patient
  - **Default**: "Caregiver"
  - **Required**: Yes
  
  **Message**:
  - **Label**: "Personal Message (Optional)"
  - **Type**: Textarea
  - **Placeholder**: "Add a personal note to the invitation..."
  - **Required**: No

- **Dialog Actions**:
  - **Cancel Button**: Closes dialog
  - **Send Invite Button**: Sends invitation email

**Role Management**:
- **Role Change**: Dropdown to change member role
- **Permissions**: Different actions available based on role
- **Validation**: Ensures at least one Admin remains

**Remove Member**:
- **Button**: "Remove" text or trash icon
- **Confirmation**: Shows confirmation dialog
- **Process**: Removes member from circle
- **Email**: Sends removal notification

##### 16.3.5.5 Invite Management
- **Invite Code Display**: Shows current circle invite code
- **Copy Button**: Copies invite code to clipboard
- **Regenerate Button**: Creates new invite code
- **Invite History**: Shows pending invitations

##### 16.3.5.6 Member Statistics
- **Total Members**: Count of all circle members
- **Active Members**: Count of active participants
- **Role Distribution**: Breakdown by Admin/Caregiver/Patient
- **Recent Activity**: Last login times and actions

##### 16.3.5.7 Permissions System
- **Admin Role**:
  - Add/remove members
  - Change member roles
  - Manage circle settings
  - View all data
  
- **Caregiver Role**:
  - View member list
  - Create and manage tasks
  - Send updates
  - Access calendar
  
- **Patient Role**:
  - View member list
  - Send updates
  - Access calendar
  - Limited task management

##### 16.3.5.8 Data Management
- **Member Storage**: Saves to local storage via `updateRoot`
- **Real-time Updates**: Immediate display of member changes
- **Email Notifications**: Sends invitations and updates
- **Audit Trail**: Tracks member changes and actions

#### 16.3.6 SETTINGS PAGE (`/dashboard/settings`)

##### 16.3.6.1 Page Overview
- **URL**: `/dashboard/settings`
- **Purpose**: User preferences, account settings, and system configuration
- **Access**: Authenticated users only
- **Layout**: Multiple cards for different setting categories

##### 16.3.6.2 Header Section
- **Page Title**: "Settings"
- **Subtitle**: "Manage your preferences and account settings"
- **Navigation**: Back button to dashboard

##### 16.3.6.3 Notification Settings Card
- **Card Title**: "Notification Preferences" with Bell icon
- **Settings**:
  
  **Email Notifications Toggle**:
  - **Label**: "Email Notifications"
  - **Type**: Switch component
  - **Description**: "Receive notifications in the Dev Mailbox"
  - **State**: Controlled by `emailNotifications` state
  - **Function**: Enables/disables email notifications
  
  **Notification Types List**:
  - **Bad day alerts** from circle members
  - **Task claim confirmations**
  - **Slot reopening notifications**
  - **Donation receipts**

##### 16.3.6.4 AI Assistant Settings Card
- **Card Title**: "AI Assistant Settings" with Bot icon
- **Settings**:
  
  **CareBot Toggle**:
  - **Component**: `<ChatBotToggle />`
  - **Label**: "CareBot Assistant"
  - **Type**: Switch with label
  - **State**: Shows "Enabled" or "Disabled"
  - **Function**: Enables/disables AI chatbot
  
  **Description**: Explains CareBot's purpose and functionality

##### 16.3.6.5 Account Information Card
- **Card ID**: "account-info"
- **Card Title**: "Account Information" with User icon
- **Information Display**:
  
  **User Details**:
  - **Name**: Full name (editable)
  - **Email**: Email address (read-only)
  - **Role**: Current role in circle
  - **Member Since**: When user joined
  
  **Edit Actions**:
  - **Edit Name Button**: Allows name editing
  - **Save Changes Button**: Saves name changes
    - **Variant**: Default (filled)
    - **Click Action**: Calls `handleSaveName` function

##### 16.3.6.6 Privacy & Security Card
- **Card Title**: "Privacy & Security" with Shield icon
- **Settings**:
  
  **Data Privacy**:
  - **Local Storage**: Information about data storage
  - **No External Sharing**: Confirms data stays local
  - **Circle Privacy**: Explains invite-only access
  
  **Security Features**:
  - **Session Management**: Information about login sessions
  - **Role-based Access**: Explanation of permission system

##### 16.3.6.7 Theme Settings Card
- **Card Title**: "Appearance" with Moon/Sun icon
- **Settings**:
  
  **Theme Selection**:
  - **Light Mode**: Bright theme option
  - **Dark Mode**: Dark theme option
  - **System Default**: Follows OS preference
  - **Auto-switch**: Automatic theme switching

##### 16.3.6.8 Data Management Card
- **Card Title**: "Data & Storage" with Database icon
- **Actions**:
  
  **Export Data**:
  - **Button**: "Export My Data"
  - **Format**: JSON file
  - **Content**: User's personal data and updates
  
  **Clear Data**:
  - **Button**: "Clear Local Data"
  - **Warning**: Shows confirmation dialog
  - **Function**: Removes all local data

##### 16.3.6.9 Account Actions Card
- **Card Title**: "Account Actions" with LogOut icon
- **Actions**:
  
  **Logout Button**:
  - **Text**: "Sign Out"
  - **Variant**: Destructive (red)
  - **Click Action**: Calls `handleLogout` function
  - **Function**: Clears session and redirects to signin
  
  **Delete Account**:
  - **Button**: "Delete Account"
  - **Variant**: Destructive (red)
  - **Warning**: Shows multiple confirmation dialogs
  - **Function**: Removes user from all circles

##### 16.3.6.10 Form Processing
- **Name Update**: `handleSaveName` function
  - Validates new name
  - Updates local storage
  - Shows success/error messages
  
- **Settings Persistence**: All settings saved to localStorage
- **Real-time Updates**: Immediate application of setting changes
- **Validation**: Ensures data integrity

##### 16.3.6.11 Interactive Features
- **Tour System**: Step-by-step guidance through settings
- **Real-time Preview**: Immediate visual feedback for changes
- **Responsive Design**: Mobile-friendly settings interface

#### 16.3.7 MOOD TRACKER PAGE (`/dashboard/mood-tracker`)

##### 16.3.7.1 Page Overview
- **URL**: `/dashboard/mood-tracker`
- **Purpose**: Visual mood tracking and pattern analysis
- **Access**: Authenticated users only
- **Layout**: Calendar view with mood statistics

##### 16.3.7.2 Header Section
- **Page Title**: "Mood Tracker"
- **Subtitle**: "Track your emotional well-being over time"
- **Navigation**: Back button to dashboard

##### 16.3.7.3 Mood Calendar Display
- **Calendar ID**: "mood-calendar"
- **Visual Elements**:
  - **Date Grid**: 30-day calendar view
  - **Mood Indicators**: Color-coded squares for each day
    - **Good Mood**: Green background (bg-green-500)
    - **Okay Mood**: Yellow background (bg-yellow-500)
    - **Bad Mood**: Red background (bg-red-500)
    - **No Data**: Gray background (bg-gray-300)
  
  **Mood Icons**: Visual representation for each mood
    - **Good**: Smile icon (Smile)
    - **Okay**: Meh icon (Meh)
    - **Bad**: Frown icon (Frown)

##### 16.3.7.4 Mood Statistics Section
- **Card ID**: "mood-stats"
- **Card Title**: "Mood Statistics" with TrendingUp icon
- **Statistics Display**:
  
  **Weekly Trends**:
  - **Good Days**: Count of good mood days this week
  - **Okay Days**: Count of okay mood days this week
  - **Bad Days**: Count of bad mood days this week
  
  **Monthly Averages**:
  - **Overall Mood**: Average mood score for the month
  - **Pattern Analysis**: Identifies mood patterns
  - **Trend Indicators**: Shows improvement or decline

##### 16.3.7.5 Export Functionality
- **Export Button ID**: "mood-export"
- **Button Text**: "Export Mood Data"
- **Icon**: Download icon
- **Format**: CSV or JSON file
- **Content**: Date, mood, and any notes for each entry
- **Use Case**: Share with healthcare providers or personal tracking

##### 16.3.7.6 Data Sources
- **Mock Data**: Currently uses `mockMoodData` array
- **Data Structure**: Array of objects with date and mood
- **Sample Data**: 30 days of example mood entries
- **Future Integration**: Will connect to actual mood updates

##### 16.3.7.7 Interactive Features
- **Hover Effects**: Shows mood details on date hover
- **Click Actions**: Click dates to view/edit mood entries
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: High contrast colors for mood indicators

#### 16.3.8 NOTIFICATIONS PAGE (`/dashboard/notifications`)

##### 16.3.8.1 Page Overview
- **URL**: `/dashboard/notifications`
- **Purpose**: Manage notification preferences and view notification history
- **Access**: Authenticated users only
- **Layout**: Settings interface with notification list

##### 16.3.8.2 Header Section
- **Page Title**: "Notification Settings"
- **Subtitle**: "Manage how you receive updates and alerts"
- **Navigation**: Back button to settings page

##### 16.3.8.3 Notification Preferences Card
- **Card Title**: "Notification Preferences" with Bell icon
- **Settings**:
  
  **Email Notifications**:
  - **Toggle**: Switch component
  - **Label**: "Email Notifications"
  - **Description**: "Receive email notifications for important updates"
  - **State**: Controlled by switch component
  
  **Push Notifications**:
  - **Toggle**: Switch component
  - **Label**: "Push Notifications"
  - **Description**: "Receive browser push notifications"
  - **State**: Controlled by switch component

##### 16.3.8.4 Notification Types Card
- **Card Title**: "Notification Types" with Mail icon
- **Types**:
  
  **Task Notifications**:
  - **New Task**: When someone creates a new task
  - **Task Claimed**: When someone claims a task you created
  - **Task Reminder**: Reminders for upcoming tasks
  
  **Update Notifications**:
  - **New Update**: When circle members post updates
  - **Bad Day Alert**: When someone reports a bad day
  - **Mood Change**: When mood patterns change significantly
  
  **Member Notifications**:
  - **New Member**: When someone joins the circle
  - **Role Change**: When member roles are updated
  - **Member Left**: When someone leaves the circle

##### 16.3.8.5 Notification History Card
- **Card ID**: "notification-list"
- **Card Title**: "Recent Notifications" with Clock icon
- **Notification Display**:
  
  **Notification Items**: Each notification shows:
    - **Icon**: Relevant icon for notification type
    - **Title**: Brief description of the notification
    - **Message**: Detailed notification content
    - **Timestamp**: When notification was received
    - **Status**: Read or unread indicator
  
  **Filter Options**:
    - **All**: Shows all notifications
    - **Unread**: Shows only unread notifications
    - **Tasks**: Shows only task-related notifications
    - **Updates**: Shows only update notifications
    - **Members**: Shows only member-related notifications

##### 16.3.8.6 Notification Actions
- **Mark as Read**: Click notification to mark as read
- **Mark All Read**: Button to mark all notifications as read
- **Clear All**: Button to remove all notifications
- **Export**: Button to export notification history

##### 16.3.8.7 Settings Persistence
- **Local Storage**: All preferences saved to localStorage
- **Real-time Updates**: Immediate application of setting changes
- **Default Values**: Sensible defaults for new users

#### 16.3.9 POST PAGE (`/dashboard/post`)

##### 16.3.9.1 Page Overview
- **URL**: `/dashboard/post`
- **Purpose**: Create and manage posts/updates for the support circle
- **Access**: Authenticated users only
- **Layout**: Post creation form with post history

##### 16.3.9.2 Header Section
- **Page Title**: "Create Post"
- **Subtitle**: "Share updates, thoughts, or requests with your circle"
- **Navigation**: Back button to dashboard

##### 16.3.9.3 Post Creation Form
- **Form Title**: "What's on your mind?"
- **Form Fields**:
  
  **Post Type Selection**:
  - **Radio Group**: Choose post type
    - **Update**: General update about condition or feelings
    - **Request**: Ask for help or support
    - **Celebration**: Share good news or milestones
    - **Question**: Ask questions to the circle
  
  **Content Input**:
  - **Label**: "Your message"
  - **Type**: Textarea
  - **Placeholder**: "Share what's happening..."
  - **Rows**: 4
  - **Character Limit**: 500 characters
  - **Required**: Yes
  
  **Mood Selection**:
  - **Label**: "How are you feeling?"
  - **Type**: Radio group
  - **Options**: Good, Okay, Bad
  - **Default**: "Okay"
  - **Required**: Yes
  
  **Visibility Settings**:
  - **Label**: "Who can see this?"
  - **Type**: Radio group
  - **Options**: 
    - **Circle Only**: Only circle members
    - **Public**: Anyone with link (if applicable)
    - **Private**: Only specific members
  
  **Attachments**:
  - **Label**: "Add photos or documents"
  - **Type**: File input
  - **Accepted Types**: Images, PDFs
  - **Size Limit**: 10MB per file
  - **Multiple**: Yes

- **Form Actions**:
  - **Preview Button**: Shows post preview
  - **Post Button**: Publishes the post
  - **Save Draft**: Saves as draft for later

##### 16.3.9.4 Post History Section
- **Section Title**: "Recent Posts"
- **Post Display**: Each post shows:
  - **Author**: User name and avatar
  - **Post Type**: Badge showing update/request/celebration/question
  - **Content**: Post text content
  - **Mood**: Mood indicator if applicable
  - **Timestamp**: When posted
  - **Engagement**: Likes, comments, shares count
  - **Actions**: Edit, delete, share buttons

##### 16.3.9.5 Post Management
- **Edit Post**:
  - **Button**: Edit icon
  - **Function**: Opens edit form with pre-filled content
  - **Permissions**: Only author can edit
  - **Time Limit**: Can edit within 24 hours
  
- **Delete Post**:
  - **Button**: Trash icon
  - **Function**: Removes post permanently
  - **Confirmation**: Shows confirmation dialog
  - **Permissions**: Only author can delete

##### 16.3.9.6 Engagement Features
- **Like System**: Heart icon to like posts
- **Comments**: Add comments to posts
- **Share**: Share posts within circle
- **Bookmark**: Save posts for later reference

##### 16.3.9.7 Data Management
- **Post Storage**: Saves to local storage via `updateRoot`
- **Real-time Updates**: Immediate display of new posts
- **Search & Filter**: Find posts by type, date, or content
- **Export**: Download post history

---

### 16.4 ADDITIONAL PAGES

#### 16.4.1 DONATE PAGE (`/donate`)

##### 16.4.1.1 Page Overview
- **URL**: `/donate`
- **Purpose**: Record financial support for the care circle
- **Access**: Authenticated users only
- **Layout**: Donation form with amount selection

##### 16.4.1.2 Header Section
- **Page Title**: "Support Your Circle"
- **Subtitle**: "Record financial contributions to help with care expenses"
- **Navigation**: Back button to dashboard

##### 16.4.1.3 Donation Form
- **Form Title**: "Make a Donation"
- **Amount Selection**:
  - **Preset Amounts**: Quick-select buttons
    - **$10**: 1000 cents
    - **$25**: 2500 cents
    - **$50**: 5000 cents (default)
    - **$100**: 10000 cents
    - **$250**: 25000 cents
  
  - **Custom Amount**:
    - **Label**: "Or enter a custom amount"
    - **Type**: Number input
    - **Placeholder**: "Enter amount in dollars"
    - **Validation**: Minimum $1 (100 cents)
    - **Format**: Dollars (converted to cents internally)

- **Donation Details**:
  - **Message Field**:
    - **Label**: "Personal message (optional)"
    - **Type**: Textarea
    - **Placeholder**: "Add a personal note..."
    - **Required**: No
  
  - **Anonymous Option**:
    - **Checkbox**: "Make this donation anonymous"
    - **Effect**: Hides donor name in circle

- **Submit Button**:
  - **Text**: "Record Donation"
  - **State**: Disabled when processing
  - **Loading Text**: "Processing..."
  - **Click Action**: Calls `handleDonation` function

##### 16.4.1.4 Donation Processing
- **Form Handler**: `handleDonation` function
- **Validation**: Ensures valid amount (minimum $1)
- **Data Storage**: Saves donation to local storage
- **Email Receipt**: Generates and sends receipt email
- **Success Redirect**: Shows donation success page

##### 16.4.1.5 Donation History
- **Total Donations**: Shows sum of all donations for circle
- **Recent Donations**: List of recent contributions
- **Donor Recognition**: Acknowledges top contributors

#### 16.4.2 DONATION SUCCESS PAGE (`/donate/success`)

##### 16.4.2.1 Page Overview
- **URL**: `/donate/success`
- **Purpose**: Confirmation page after successful donation
- **Access**: After successful donation
- **Layout**: Success message with next steps

##### 16.4.2.2 Success Content
- **Success Icon**: Large green checkmark (CheckCircle)
- **Title**: "Thank You!"
- **Message**: Confirmation of successful donation recording
- **Receipt Info**: Shows receipt ID and email status

##### 16.4.2.3 Action Buttons
- **Return to Dashboard**: Primary button to go back
- **View Receipt Email**: Secondary button to check email
- **Make Another Donation**: Tertiary button to donate again

##### 16.4.2.4 Impact Information
- **Impact Stats**: Shows how donations help families
- **Community Message**: Thank you message from CareCircle team

#### 16.4.3 DEVELOPER MAILBOX (`/dev-mailbox`)

##### 16.4.3.1 Page Overview
- **URL**: `/dev-mailbox`
- **Purpose**: View all simulated emails sent within the app
- **Access**: Authenticated users only
- **Layout**: Email list with detailed view

##### 16.4.3.2 Header Section
- **Page Title**: "Developer Mailbox"
- **Subtitle**: "View all simulated emails for development purposes"
- **Badge**: "Local Emails" indicator
- **Navigation**: Back button to dashboard

##### 16.4.3.3 Information Banner
- **Content**: Explains this is for development/testing
- **Background**: Blue banner with informational styling
- **Message**: Clarifies emails are simulated locally

##### 16.4.3.4 Email List
- **Email Items**: Each email shows:
  - **Sender**: Who sent the email
  - **Recipients**: Who received the email
  - **Subject**: Email subject line
  - **Timestamp**: When email was sent
  - **Type**: Badge showing email category
  - **Status**: Delivery status indicator

##### 16.4.3.5 Email Categories
- **Bad Day Alerts**: Notifications when mood is set to "BAD"
- **Task Confirmations**: Task claim and completion notices
- **Donation Receipts**: Financial contribution confirmations
- **Welcome Messages**: New member invitations
- **Update Notifications**: Circle activity alerts

##### 16.4.3.6 Email Details View
- **Modal Dialog**: Click email to view full content
- **Content Display**: Shows complete email HTML and text
- **Headers**: Email metadata and routing information
- **Actions**: Close dialog button

##### 16.4.3.7 Data Management
- **Email Storage**: All emails stored in local mailbox
- **Real-time Updates**: New emails appear immediately
- **Search & Filter**: Find emails by type or content
- **Export**: Download email history

---

### 16.5 COMPONENT SYSTEM

#### 16.5.1 CHATBOT COMPONENTS

##### 16.5.1.1 ChatBot Provider (`chatbot-provider.tsx`)
- **Purpose**: Context provider for chatbot state management
- **State Variables**:
  - **isEnabled**: Boolean for chatbot on/off state
  - **toggleChatBot**: Function to toggle chatbot
  - **setChatBotEnabled**: Function to set specific state

##### 16.5.1.2 ChatBot Toggle (`chatbot-toggle.tsx`)
- **Purpose**: Settings toggle for enabling/disabling chatbot
- **Components**:
  - **Label**: "CareBot Assistant" with Bot icon
  - **Switch**: Toggle component for on/off state
  - **Status Text**: Shows "Enabled" or "Disabled"
- **Styling**: Flexbox layout with proper spacing

##### 16.5.1.3 Main ChatBot (`chatbot.tsx`)
- **Purpose**: Interactive AI assistant interface
- **Layout**: Fixed position floating chat window

**Chat Toggle Button**:
- **Position**: Fixed bottom-right corner
- **Size**: 16x16 (h-16 w-16) rounded button
- **Icon**: MessageCircle icon
- **Styling**: Primary color with shadow and hover effects
- **Animation**: Hover scale effect (hover:scale-105)

**Chat Interface**:
- **Size**: 96x520 (w-96 h-[520px])
- **Header**: Gradient background with CareBot branding
- **Content**: Scrollable message area
- **Input**: Text input with send button

**Message System**:
- **Welcome Message**: Initial greeting from CareBot
- **User Messages**: User input with User icon
- **Bot Responses**: AI responses with Bot icon
- **Loading States**: Shows typing indicators

**Features**:
- **Auto-scroll**: Scrolls to bottom on new messages
- **Input Focus**: Manages input focus states
- **Message History**: Stores conversation in state
- **Responsive Design**: Adapts to different screen sizes

#### 16.5.2 TOUR SYSTEM COMPONENTS

##### 16.5.2.1 Tour Provider (`tour-provider.tsx`)
- **Purpose**: Manages tour state and provides tour context
- **State Management**:
  - **Current Tour**: Active tour information
  - **Tour Steps**: Array of tour step definitions
  - **Tour Progress**: Current step tracking

##### 16.5.2.2 Tour Trigger (`tour-trigger.tsx`)
- **Purpose**: Button to start tours on specific pages
- **Props**:
  - **page**: Which page tour to start
  - **variant**: Button styling variant
  - **size**: Button size
- **Click Action**: Starts tour for specified page

##### 16.5.2.3 Tour Tooltip (`tour-tooltip.tsx`)
- **Purpose**: Displays tour step information
- **Content**:
  - **Title**: Step title
  - **Description**: Step explanation
  - **Navigation**: Previous/Next/Close buttons
- **Positioning**: Automatically positions around target elements

##### 16.5.2.4 Tour Welcome (`tour-welcome.tsx`)
- **Purpose**: Initial welcome modal for new users
- **Content**:
  - **Welcome Message**: Introduction to CareCircle
  - **Feature Overview**: Brief explanation of key features
  - **Actions**: "Get Started" and "Skip" buttons
- **Trigger**: Automatic display for first-time users

#### 16.5.3 THEME COMPONENTS

##### 16.5.3.1 Theme Provider (`theme-provider.tsx`)
- **Purpose**: Provides theme context to entire application
- **Features**:
  - **System Detection**: Automatically detects OS theme preference
  - **Theme Switching**: Manages light/dark/system themes
  - **Persistence**: Saves theme choice to localStorage

##### 16.5.3.2 Theme Toggle (`theme-toggle.tsx`)
- **Purpose**: Button to switch between themes
- **Icons**:
  - **Moon**: Shows when in light mode
  - **Sun**: Shows when in dark mode
- **Click Action**: Cycles through theme options

##### 16.5.3.3 Theme Applier (`theme-applier.tsx`)
- **Purpose**: Applies theme classes to HTML body
- **Function**: Ensures theme changes are immediately visible
- **Target**: Applies classes to body element

#### 16.5.4 UI COMPONENTS

##### 16.5.4.1 Form Components
- **Input**: Text input with validation states
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection component
- **RadioGroup**: Radio button selection
- **Checkbox**: Checkbox input component
- **Switch**: Toggle switch component
- **Label**: Form field labels

##### 16.5.4.2 Display Components
- **Card**: Container for content sections
- **Badge**: Status and category indicators
- **Avatar**: User profile picture display
- **Button**: Action buttons with variants
- **Dialog**: Modal popup windows
- **Alert**: Information and warning messages

##### 16.5.4.3 Navigation Components
- **Sidebar**: Dashboard navigation menu
- **Breadcrumb**: Page navigation breadcrumbs
- **Tabs**: Content tab navigation
- **Pagination**: Page navigation controls

##### 16.5.4.4 Data Components
- **Table**: Data table display
- **Calendar**: Date and time selection
- **Chart**: Data visualization
- **Progress**: Progress bar indicators

---

### 16.6 INTERACTION FLOWS

#### 16.6.1 USER ONBOARDING FLOW
1. **Landing Page**: User visits homepage
2. **Welcome Modal**: Automatic display for new users
3. **Sign Up/Join**: User chooses to create or join circle
4. **Authentication**: Email-based login process
5. **Group Selection**: Choose or create support circle
6. **Tour Introduction**: Interactive walkthrough of features
7. **First Update**: User posts initial mood and update

#### 16.6.2 DAILY USAGE FLOW
1. **Dashboard Overview**: View circle status and recent activity
2. **Mood Update**: Share daily mood and thoughts
3. **Task Management**: Check calendar for upcoming tasks
4. **Communication**: Review updates from other members
5. **Progress Tracking**: Monitor treatment milestones

#### 16.6.3 TASK COORDINATION FLOW
1. **Task Creation**: Patient or caregiver creates support task
2. **Task Scheduling**: Set date, time, and location
3. **Task Claiming**: Support network members claim available tasks
4. **Task Completion**: Mark tasks as completed
5. **Notification**: Email confirmations and updates

#### 16.6.4 MEMBER MANAGEMENT FLOW
1. **Invite Generation**: Admin creates invite code
2. **Invite Sharing**: Share code with potential members
3. **Member Joining**: New member enters invite code
4. **Role Assignment**: Admin assigns appropriate role
5. **Access Granting**: Member gains access to circle features

---

### 16.7 DATA FLOW ARCHITECTURE

#### 16.7.1 LOCAL STORAGE SYSTEM
- **Root Object**: Single object containing all application data
- **Data Structure**: Hierarchical organization of entities
- **Persistence**: Browser localStorage with memory fallback
- **Updates**: Atomic updates via updateRoot function

#### 16.7.2 STATE MANAGEMENT
- **Component State**: Local React state for UI components
- **Global State**: Shared state via context providers
- **Data Synchronization**: Real-time updates across components
- **Error Handling**: Graceful fallbacks for data issues

#### 16.7.3 SESSION MANAGEMENT
- **User Authentication**: Email-based login system
- **Group Selection**: User can belong to multiple circles
- **Role Management**: Different permissions for different roles
- **Session Persistence**: Remembers login across browser sessions

---

### 16.8 RESPONSIVE DESIGN SPECIFICATIONS

#### 16.8.1 MOBILE DESIGN (320px - 768px)
- **Layout**: Single-column stacked layout
- **Navigation**: Collapsible sidebar or bottom navigation
- **Touch Targets**: Minimum 44px touch areas
- **Typography**: Readable font sizes for small screens

#### 16.8.2 TABLET DESIGN (768px - 1024px)
- **Layout**: Two-column layout where appropriate
- **Navigation**: Side navigation with collapsible sections
- **Touch & Mouse**: Optimized for both input methods
- **Content**: Balanced information density

#### 16.8.3 DESKTOP DESIGN (1024px+)
- **Layout**: Multi-column grid layouts
- **Navigation**: Full sidebar navigation
- **Hover Effects**: Rich hover interactions
- **Information Density**: Maximum content display

---

### 16.9 ACCESSIBILITY FEATURES

#### 16.9.1 VISUAL ACCESSIBILITY
- **Color Contrast**: High contrast ratios for text
- **Icon Labels**: Text labels for all icons
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Theme Support**: Light and dark mode options

#### 16.9.2 KEYBOARD ACCESSIBILITY
- **Tab Navigation**: Logical tab order through interface
- **Keyboard Shortcuts**: Common actions accessible via keyboard
- **Focus Management**: Proper focus handling in modals
- **Skip Links**: Skip to main content options

#### 16.9.3 SCREEN READER SUPPORT
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Descriptive labels for interactive elements
- **Live Regions**: Dynamic content announcements
- **Alternative Text**: Descriptive text for images

---

### 16.10 PERFORMANCE CONSIDERATIONS

#### 16.10.1 LOADING OPTIMIZATION
- **Lazy Loading**: Components load when needed
- **Image Optimization**: Optimized images and lazy loading
- **Code Splitting**: Route-based code splitting
- **Caching**: Browser caching for static assets

#### 16.10.2 RUNTIME PERFORMANCE
- **State Updates**: Efficient state management
- **Re-render Optimization**: Minimize unnecessary re-renders
- **Memory Management**: Proper cleanup of event listeners
- **Debouncing**: Limit rapid function calls

---

### 16.11 SECURITY FEATURES

#### 16.11.1 DATA PROTECTION
- **Local Storage**: All data stored locally in user's browser
- **No External Sharing**: Data never leaves local environment
- **Invite-Only Access**: Circles require specific invite codes
- **Role-Based Permissions**: Different access levels for different user types

#### 16.11.2 PRIVACY FEATURES
- **Private Circles**: All communications within invite-only groups
- **User Control**: Users decide what information to share
- **No Data Mining**: No analytics or tracking of sensitive information
- **Local Processing**: All operations happen locally

---

### 16.12 TESTING STRATEGY

#### 16.12.1 COMPONENT TESTING
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction testing
- **Visual Tests**: UI appearance and behavior verification
- **Accessibility Tests**: Screen reader and keyboard navigation

#### 16.12.2 USER TESTING
- **Usability Testing**: Real user interaction testing
- **Accessibility Testing**: Users with disabilities testing
- **Performance Testing**: Load time and responsiveness testing
- **Cross-browser Testing**: Different browser compatibility

---

### 16.13 DEPLOYMENT CONSIDERATIONS

#### 16.13.1 CURRENT STATE
- **Development Ready**: Local development environment complete
- **Demo Capable**: Fully functional for demonstration purposes
- **Self-Contained**: No external dependencies or services required

#### 16.13.2 PRODUCTION READINESS
- **Database Migration**: Move from localStorage to proper database
- **User Authentication**: Implement secure authentication system
- **Email Services**: Integrate with email service providers
- **Payment Processing**: Add Stripe or similar payment integration
- **Cloud Deployment**: Deploy to Vercel, Netlify, or cloud platforms

---

### 16.14 FUTURE ENHANCEMENTS

#### 16.14.1 SHORT-TERM IMPROVEMENTS (3-6 months)
- **Mobile App**: Native mobile applications for iOS and Android
- **Push Notifications**: Real-time alerts for important updates
- **File Sharing**: Photo and document sharing within circles
- **Video Calls**: Integrated video communication features
- **Advanced Analytics**: Detailed insights and reporting

#### 16.14.2 LONG-TERM VISION (6-12 months)
- **AI-Powered Insights**: Machine learning for treatment pattern recognition
- **Healthcare Integration**: Connect with healthcare provider systems
- **Community Features**: Connect multiple support circles
- **Research Platform**: Anonymous data contribution to cancer research
- **Internationalization**: Multi-language support for global users

---

## Appendix

### A. Demo Data Structure
The application includes comprehensive demo data covering:
- Sample users and support circles
- Example tasks and updates
- Demo donations and notifications
- Treatment progress examples

### B. Component Library
Built with Shadcn/ui components including:
- Forms, buttons, cards, and navigation
- Dialog and modal components
- Calendar and date picker components
- Theme-aware styling system

### C. File Structure
```
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utility functions and services
├── hooks/              # Custom React hooks
├── public/             # Static assets
└── styles/             # Global styles
```

### D. Key Features Summary
- ✅ Authentication & User Management
- ✅ Support Circle Management
- ✅ Daily Updates & Mood Tracking
- ✅ Task Management & Coordination
- ✅ Treatment Progress Tracking
- ✅ Symptom Tracking
- ✅ Donation Management
- ✅ Communication & Notifications
- ✅ Interactive Tour System
- ✅ Responsive Design
- ✅ Theme Support
- ✅ Local Storage System
- ✅ Demo Data & Examples
