import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { SeedProvider } from '@/components/seed-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { TourProvider } from '@/components/tour/tour-provider'
import { TourTooltip } from '@/components/tour/tour-tooltip'
import { ChatBotProvider, ChatBot } from '@/components/chatbot'
import { ThemeApplier } from '@/components/theme-applier'
import { AutoLogin } from '@/components/auto-login'

export const metadata: Metadata = {
  title: 'CareCircle - Cancer Support Portal',
  description: 'A private, secure space for cancer patients to share daily updates and coordinate support from loved ones.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
        id="theme-applied"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeApplier />
          <ChatBotProvider>
            <TourProvider>
              <SeedProvider>
                <AutoLogin />
                {children}
                <TourTooltip />
              </SeedProvider>
            </TourProvider>
            <ChatBot />
          </ChatBotProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
