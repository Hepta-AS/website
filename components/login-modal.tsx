"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("[LoginModal] Login form submitted for email:", email)
    setLoading(true)
    setError(null)

    try {
      console.log("[LoginModal] Calling login function from auth context...")
      await login(email, password)
      console.log("[LoginModal] Login successful. Redirecting to /dashboard...")
      onClose()
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      console.error("[LoginModal] Login failed. Error:", err)
      setError(err.message || "An unknown error occurred during login.")
    } finally {
      console.log("[LoginModal] handleLogin function finished.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logg inn</DialogTitle>
          <DialogDescription>Logg inn med e-post og passord</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <Input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logger inn...
              </>
            ) : (
              "Logg inn"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
