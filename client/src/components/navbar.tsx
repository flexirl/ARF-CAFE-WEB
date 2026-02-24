"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingCart, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { StoreBanner } from "./store-banner"
import { Galindo } from "next/font/google";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from "@/lib/api"
  const galindo = Galindo({
  subsets: ["latin"],
  weight: "400",
});

export function Navbar() {

  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const isAdmin = user?.role === "admin"

  const [isOpen, setIsOpen] = useState(false)
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [storeOpensAt, setStoreOpensAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings")
        setIsStoreOpen(data.isStoreOpen ?? true)
        setStoreOpensAt(data.storeOpensAt ?? null)
      } catch {}
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
        { href: "/#contact", label: "Contact" },
        {href: "/#aboutUs", label: "About us"}
      ]

  return (
    <>
      <StoreBanner isStoreOpen={isStoreOpen} storeOpensAt={storeOpensAt} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">

        <div className="container mx-auto flex items-center justify-between h-16 px-4 relative">

          {/* Desktop Left Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-lg tracking-wide text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Center Logo */}

{/* Center Logo */}
<Link
  href="/"
  className={`absolute left-1/2 -translate-x-1/2 text-center ${galindo.className} text-primary`}
>
  {/* Desktop (unchanged) */}
  <span className="hidden md:block text-3xl lg:text-4xl tracking-wide">
    KRAVINGS by ARF
  </span>

  {/* Tablet */}
  <span className="hidden sm:block md:hidden text-2xl tracking-wide">
    KRAVINGS by ARF
  </span>

  {/* Mobile */}
  <span className="block sm:hidden leading-tight">
    <span className="block text-2xl font-semibold tracking-wide">
      KRAVINGS
    </span>
    <span className="block text-sm tracking-widest opacity-80">
      by ARF
    </span>
  </span>
</Link>


          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">

            {/* Cart always visible */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="font-display text-lg text-foreground hover:text-primary transition-colors"
                >
                  LOGIN
                </Link>

                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground font-display text-lg px-5 py-2 rounded-sm hover:bg-primary/90 transition-colors tracking-wide"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-foreground z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-background border-b border-border px-4 pb-6 pt-2"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 font-display text-xl text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Cart always visible */}
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block py-3 font-display text-xl text-foreground hover:text-primary"
              >
                CART ({cartCount})
              </Link>

              {!user && (
                <div className="mt-6 flex flex-col gap-4">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block font-display text-xl text-foreground hover:text-primary"
                  >
                    LOGIN
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block bg-primary text-primary-foreground font-display text-xl px-6 py-3 rounded-sm text-center"
                  >
                    SIGN UP
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </>
  )
}