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
import { useAuth } from "@/components/auth-provider"
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
    console.log("[LoginModal] ===== LOGIN ATTEMPT STARTED =====")
    console.log("[LoginModal] Form submitted with email:", email)
    console.log("[LoginModal] Password length:", password.length)
    console.log("[LoginModal] Current loading state:", loading)
    
    setLoading(true)
    setError(null)
    console.log("[LoginModal] Set loading to true and cleared error")

    try {
      console.log("[LoginModal] About to call login function from auth context...")
      console.log("[LoginModal] Email being sent:", email)
      console.log("[LoginModal] Password being sent: [HIDDEN]")
      
      const loginStartTime = Date.now()
      await login(email, password)
      const loginEndTime = Date.now()
      
      console.log("[LoginModal] Login function completed successfully!")
      console.log("[LoginModal] Login took:", loginEndTime - loginStartTime, "ms")
      console.log("[LoginModal] About to close modal and redirect...")
      
      onClose()
      router.push("/dashboard")
      router.refresh()
      
      console.log("[LoginModal] Redirect initiated to /dashboard")
    } catch (err: any) {
      console.error("[LoginModal] ===== LOGIN FAILED =====")
      console.error("[LoginModal] Error object:", err)
      console.error("[LoginModal] Error message:", err.message)
      console.error("[LoginModal] Error stack:", err.stack)
      console.error("[LoginModal] Error type:", typeof err)
      
      const errorMessage = err.message || "An unknown error occurred during login."
      console.log("[LoginModal] Setting error message:", errorMessage)
      setError(errorMessage)
    } finally {
      console.log("[LoginModal] Setting loading to false")
      setLoading(false)
      console.log("[LoginModal] ===== LOGIN ATTEMPT FINISHED =====")
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
