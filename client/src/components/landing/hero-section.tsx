import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-orange-400/5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/3" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl animate-[fadeIn_0.5s_ease-out]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              #1 Rated by KIIT Students
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              Midnight Cravings? <br/>
              <span className="text-gradient">We Got You.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              Gourmet, hygienic, and affordable meals delivered blazing fast around KIIT. Because studying late requires good food.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg font-bold transition-all glow-orange hover:glow-orange-strong hover:-translate-y-1"
              >
                Order Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl text-lg font-bold transition-all hover:-translate-y-1"
              >
                View Menu <Utensils className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-secondary border-2 border-background flex items-center justify-center overflow-hidden">
                    <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="User avatar" width={40} height={40} />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="text-foreground font-bold">500+</span> KIITians</p>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative animate-[slideIn_0.6s_ease-out]">
            <div className="relative aspect-square max-w-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
              {/* Simulated Food Image — use placeholder or generic food image */}
              <div className="relative h-full w-full rounded-full border-8 border-background shadow-2xl overflow-hidden glass z-10 animate-float bg-secondary/50 flex items-center justify-center">
                <Image 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Delicious Pizza and Burger Combo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Badge 1 */}
              <div className="absolute top-1/4 -right-4 md:-right-8 bg-card px-4 py-3 rounded-2xl shadow-xl border border-border z-20 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                    🚀
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Delivery</p>
                    <p className="text-sm font-bold text-foreground">Under 20 Mins</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-1/4 -left-4 md:-left-8 bg-card px-4 py-3 rounded-2xl shadow-xl border border-border z-20 animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    🔥
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Hot & Fresh</p>
                    <p className="text-sm font-bold text-foreground">Straight from oven</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
