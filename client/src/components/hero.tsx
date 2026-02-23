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
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">
      {/* Massive Fluid Background Mesh */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full blur-[120px] bg-gradient-to-tr from-primary/10 via-orange-300/20 to-transparent"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full blur-[140px] bg-gradient-to-bl from-orange-400/10 via-primary/5 to-transparent mix-blend-multiply"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
        <div className="flex justify-center mb-16 lg:mb-0">
            {/* Center-aligned Content for High Impact */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10 text-center max-w-4xl mx-auto flex flex-col items-center"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/20 bg-background/50 backdrop-blur-md shadow-sm"
              >
                <Flame className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary uppercase tracking-widest">The Evolution of Taste</span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-bold tracking-tighter leading-[0.9] text-foreground">
                Savour the
                <br />
                <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="bg-[length:200%_auto] bg-gradient-to-r from-primary via-orange-400 to-primary text-transparent bg-clip-text"
                >
                  Future.
                </motion.span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                Gourmet cuisine engineered for perfection. Expertly crafted, lightning-fast delivery to your doorstep.
              </p>

              {/* Floating food badges adding depth */}
              <div className="absolute inset-0 pointer-events-none hidden lg:block">
                <motion.div
                  animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute top-12 left-0 xl:-left-20 glass rounded-2xl px-5 py-4 flex items-center gap-4 bg-background/80 backdrop-blur-xl border-border/50 shadow-xl"
                >
                  <div className="text-3xl">🍕</div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">Artisan Pizza</p>
                    <p className="text-xs text-muted-foreground">Wood-fired perfection</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [20, -20, 20], rotate: [2, -2, 2] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute bottom-40 left-10 xl:-left-10 glass rounded-2xl px-5 py-4 flex items-center gap-4 bg-background/80 backdrop-blur-xl border-border/50 shadow-xl"
                >
                  <div className="text-3xl">🍜</div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">Spicy Ramen</p>
                    <p className="text-xs text-muted-foreground">Authentic broth</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                  className="absolute top-40 right-0 xl:-right-20 glass rounded-2xl px-5 py-4 flex items-center gap-4 bg-background/80 backdrop-blur-xl border-border/50 shadow-xl"
                >
                  <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">4.9</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">Top Rated</p>
                    <p className="text-xs text-muted-foreground">By 10,000+ foodies</p>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4 w-full sm:w-auto relative z-10">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500" />
                  <Button
                    asChild
                    size="lg"
                    className="relative w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 rounded-full text-lg font-bold transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <Link href="/menu">
                      Experience Menu <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto h-16 px-10 rounded-full text-lg font-semibold bg-background/50 backdrop-blur-md border-border/50 hover:bg-secondary transition-all active:scale-[0.98]"
                >
                  <Link href="/menu">View Offers</Link>
                </Button>
              </div>

              {/* Minimal Stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-12 border-t border-border/30 w-full">
                {STATS.map((stat, i) => (
                  <motion.div 
                    key={stat.label} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <stat.icon className="h-4 w-4" />
                      <p className="text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
