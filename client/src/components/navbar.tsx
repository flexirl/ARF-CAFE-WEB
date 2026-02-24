"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, LogOut, ChefHat } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StoreBanner } from "./store-banner"
import api from "@/lib/api"
import { useState, useEffect } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const isAdmin = user?.role === "admin"
  
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [storeOpensAt, setStoreOpensAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings")
        setIsStoreOpen(data.isStoreOpen ?? true)
        setStoreOpensAt(data.storeOpensAt ?? null)
      } catch {
        // Fallback or ignore
      }
    }
    fetchSettings()
  }, [])

  const navItems = isAdmin
    ? [
        { href: "/menu", label: "Menu" },
        { href: "/admin", label: "Dashboard" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/menu", label: "Menu" },
        { href: "/#offers", label: "Offers" },
        { href: "#contact", label: "Contact" },
      ]

  const mobileNavItems = isAdmin
    ? [
        { href: "/menu", label: "Menu" },
        { href: "/admin", label: "Dashboard" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/menu", label: "Menu" },
        { href: "/#offers", label: "Offers" },
        { href: "/orders", label: "My Orders" },
      ]

  return (
    <>
      <StoreBanner isStoreOpen={isStoreOpen} storeOpensAt={storeOpensAt} />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-col justify-center hidden sm:flex">
            <span className="font-bold text-lg leading-none tracking-tight">
              KRAVINGS
            </span>
            <span className="text-primary text-[0.65rem] font-bold tracking-widest leading-none mt-0.5">
              BY ARF CAFE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-card border-border">
            <div className="flex items-center gap-2 mb-8 mt-2">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-lg leading-none tracking-tight">KRAVINGS</span>
                <span className="text-primary text-[0.65rem] font-bold tracking-widest leading-none mt-0.5">BY ARF CAFE</span>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          {/* Order Now Button (Desktop) */}
          {!isAdmin && (
            <Button size="sm" asChild className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg glow-orange transition-all font-semibold">
              <Link href="/menu">Order Now</Link>
            </Button>
          )}

          {/* Cart - hidden for admin */}
          {!isAdmin && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-secondary/60">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-[slideUp_0.3s_ease-out]">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* User / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/30 transition-all">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border" align="end">
                <DropdownMenuLabel className="font-normal pb-3">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {isAdmin ? (
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-secondary/60">
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-secondary/60">
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  )
}
