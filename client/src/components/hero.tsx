"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame, Clock, Star, Truck } from "lucide-react"

const STATS = [
  { icon: Flame, value: "50+", label: "Dishes" },
  { icon: Clock, value: "30min", label: "Avg Delivery" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Truck, value: "Free", label: "Delivery" },
]

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-[glow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-orange-400/10 rounded-full blur-[100px] animate-[glow_5s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Cloud Kitchen</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Taste the{" "}
              <span className="text-gradient">Future</span>
              <br />
              of Food
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Gourmet meals crafted by expert chefs, delivered hot &amp; fresh in 30 minutes.
              Premium ingredients. Exceptional flavours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-13 px-8 rounded-xl text-base font-semibold glow-orange transition-all hover:glow-orange-strong"
              >
                <Link href="/menu">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-13 px-8 rounded-xl text-base border-border hover:bg-secondary/60 hover:border-primary/30"
              >
                <Link href="/menu">Explore Menu</Link>
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-6 pt-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-150 animate-[glow_3s_ease-in-out_infinite]" />
              <div className="absolute inset-0 rounded-full border border-primary/5 scale-[2]" />

              {/* Main visual circle */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 via-orange-400/10 to-transparent flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
                <div className="text-[120px] leading-none select-none">🍔</div>
              </div>

              {/* Floating food badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-6 right-4 glass rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="text-2xl">🍕</div>
                <div>
                  <p className="text-xs font-bold">Pizza</p>
                  <p className="text-[10px] text-muted-foreground">Fresh baked</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-4 -left-8 glass rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="text-2xl">🍜</div>
                <div>
                  <p className="text-xs font-bold">Ramen</p>
                  <p className="text-[10px] text-muted-foreground">Authentic</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-8, 4, -8] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute bottom-16 -right-10 glass rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="text-xs font-bold">4.9/5</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
