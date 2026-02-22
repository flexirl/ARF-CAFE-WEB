import HeroSection from "@/components/hero";
import Link from "next/link";
import { ArrowRight, Utensils, Timer, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Utensils,
    title: "Chef Crafted",
    desc: "Every dish prepared by expert chefs using premium ingredients.",
  },
  {
    icon: Timer,
    title: "30-Min Delivery",
    desc: "Lightning-fast delivery to your doorstep while it's still hot.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene First",
    desc: "FSSAI certified kitchen with the highest hygiene standards.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why People <span className="text-gradient">Love</span> ARF Cafe
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:glow-orange"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to dig in?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse our chef-curated menu and get your favourite meals delivered in minutes.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 h-13 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all glow-orange hover:glow-orange-strong"
          >
            View Full Menu <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
