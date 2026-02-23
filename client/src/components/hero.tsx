"use client"

import Link from "next/link"

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
    <section className="relative min-h-[85vh] flex items-center bg-background border-b border-border/40">
      {/* Optimized Static Background Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-background to-background" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        <div className="flex justify-center">
            {/* Center-aligned Content for High Impact, zero JS animations */}
            <div className="space-y-8 text-center max-w-4xl mx-auto flex flex-col items-center">
              
              {/* Simple Pill Tag */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100/50 text-orange-700 border border-orange-200 shadow-sm">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Premium Cloud Kitchen</span>
              </div>

              {/* High-Performance Static Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight leading-[1.05] text-foreground">
                Savour the
                <br />
                <span className="text-primary">
                  Future.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Gourmet cuisine engineered for perfection. Expertly crafted, lightning-fast delivery to your doorstep.
              </p>

              {/* Call to Actions (Optimized with standard CSS hover states) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-10 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Link href="/menu">
                    Order Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto h-14 px-10 rounded-full text-base font-semibold bg-background border-border hover:bg-secondary transition-colors"
                >
                  <Link href="/menu">Explore Menu</Link>
                </Button>
              </div>

              {/* Minimal Static Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 border-t border-border/30 w-full mt-8">
                {STATS.map((stat) => (
                  <div 
                    key={stat.label} 
                    className="flex flex-col items-center gap-1.5"
                  >
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <stat.icon className="h-3.5 w-3.5" />
                      <p className="text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  )
}
