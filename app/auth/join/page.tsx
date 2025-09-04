"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginWithGroup, addMemberToGroup } from "@/lib/session"
import { getRoot } from "@/lib/localStore"

export default function JoinPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const root = getRoot()
      
      // Find group by invite code
      const group = Object.values(root.groups).find(g => g.inviteCode === inviteCode.toUpperCase())
      
      if (!group) {
        setError("Invalid invite code. Please check and try again.")
        return
      }

      // Create user and add to group
      const user = loginWithGroup(email, group.id, rememberMe)
      
      // Update user name if provided
      if (name.trim()) {
        const updatedUser = { ...user, name: name.trim() }
        // Update user in the root data
        const updatedRoot = {
          ...root,
          users: {
            ...root.users,
            [user.id]: updatedUser
          }
        }
        localStorage.setItem('carecircle-data', JSON.stringify(updatedRoot))
      }

      // Add user to group as member
      addMemberToGroup(user.id, group.id, 'MEMBER')
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to join circle. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join a Circle</CardTitle>
            <CardDescription>Enter your invite code to join a support circle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your full name" 
                  className="bg-input border-border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-input border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="bg-input border-border text-center text-lg tracking-widest"
                  maxLength={6}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me-join"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me-join" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Circle"}
              </Button>
            </form>

            {error && <div className="text-center text-sm text-red-500">{error}</div>}

            <div className="text-center text-sm text-muted-foreground">
              <p>Ask the circle owner for your invite code</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need to create your own circle?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Get started
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

