import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-primary/5 -z-20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ea580c\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl glass relative overflow-hidden">
          {/* Subtle animated blobs inside the card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Ready to satisfy your <br className="hidden md:block" />
            <span className="text-gradient">Midnight Cravings?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of KIIT students who have upgraded their late-night food game. Hot, fresh, and delivered in minutes.
          </p>
          
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 h-16 w-full sm:w-auto sm:px-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xl font-bold transition-all glow-orange hover:glow-orange-strong hover:scale-105"
          >
            Order Now <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground font-medium">No minimum order value.</p>
        </div>
      </div>
    </section>
  );
}
