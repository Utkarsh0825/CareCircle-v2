"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, ChevronRight } from "lucide-react"
import { getSession, selectGroup } from "@/lib/session"
import { getUserGroups } from "@/lib/session"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function SelectGroupPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const session = getSession()
    if (!session.user) {
      router.push("/auth/signin")
      return
    }

    const userGroups = getUserGroups(session.user.id)
    setGroups(userGroups)
    setIsLoading(false)

    // If only one group, auto-select it
    if (userGroups.length === 1) {
      selectGroup(userGroups[0].id)
      router.push("/dashboard")
    }
  }, [mounted, router])

  const handleSelectGroup = (groupId: string) => {
    try {
      selectGroup(groupId)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to select group:", error)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p>Loading your care circles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-4"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Select Care Circle</CardTitle>
            <CardDescription>Choose which care circle you'd like to access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No care circles found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => router.push("/join")}
                >
                  Join a Circle
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <Button
                    key={group.id}
                    variant="outline"
                    className="w-full justify-between h-auto p-4"
                    onClick={() => handleSelectGroup(group.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{group.name}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {group.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            )}

            <div className="text-center pt-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/join")}
                className="text-sm"
              >
                Join Another Circle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
