"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, ChefHat } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { AxiosError } from "axios"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await api.post("/auth/register", { name, email, password })
      login(data)
      toast.success("Account created!")
      router.push("/")
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      })
      login(data)
      toast.success("Welcome!")
      router.push("/")
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || "Google login failed")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-muted-foreground">Join KRAVINGS for exclusive perks</p>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google login failed")}
          theme="filled_black"
          shape="pill"
          size="large"
          width="360"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><Separator className="w-full bg-border" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm">Full Name</Label>
          <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-secondary border-border focus:border-primary/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-secondary border-border focus:border-primary/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} className="h-11 rounded-xl bg-secondary border-border focus:border-primary/50" />
          <p className="text-[11px] text-muted-foreground">Must be at least 6 characters</p>
        </div>
        <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
