"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    console.log("[LOGIN MODAL DEBUG] handleLogin called.")
    setLoading(true)
    setError(null)

    try {
      console.log("[LOGIN MODAL DEBUG] Calling auth.login().")
      await login(email, password)
      console.log("[LOGIN MODAL DEBUG] auth.login() successful.")
      onClose()
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      console.error("[LOGIN MODAL DEBUG] Login failed with error object:", err)
      setError(err.message || "An unknown error occurred.")
    } finally {
      console.log("[LOGIN MODAL DEBUG] handleLogin finished.")
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

        <div className="space-y-4 pt-4">
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

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            className="w-full"
            onClick={handleLogin}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
