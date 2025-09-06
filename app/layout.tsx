import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { SeedProvider } from '@/components/seed-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { ChatBotProvider, ChatBot } from '@/components/chatbot'
import { ColorSchemeApplier } from '@/components/color-scheme-applier'
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
          <ColorSchemeApplier />
          <ChatBotProvider>
            <SeedProvider>
              <AutoLogin />
              {children}
            </SeedProvider>
          </ChatBotProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
