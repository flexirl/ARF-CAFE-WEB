import { Ticket, Gift, Users } from "lucide-react";
import Link from "next/link";

export function OffersSection() {
  return (
    <section id="offers" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute -top-[20rem] -right-[20rem] w-[40rem] h-[40rem] bg-orange-500/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Special Deals</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Student-Exclusive <span className="text-gradient">Offers</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Because we know the end-of-month broke feeling too well. Make the most of these active deals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Offer 1 */}
          <div className="relative p-8 rounded-3xl bg-card border border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[100px] -z-10 group-hover:bg-primary/20 transition-colors" />
            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
              <Ticket className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Flat 20% OFF</h3>
            <p className="text-muted-foreground mb-6 text-sm">On your first order with us. Use code <span className="font-bold text-foreground bg-secondary px-2 py-1 rounded">KIIT20</span> at checkout.</p>
            <Link href="/menu" className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-sm">
              Claim Now →
            </Link>
          </div>

          {/* Offer 2 */}
          <div className="relative p-8 rounded-3xl bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] -z-10 group-hover:bg-white/20 transition-colors" />
            <div className="absolute -bottom-4 -right-4 text-white/10 opacity-50">
              <Users className="h-32 w-32" />
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Hostel Combo</h3>
            <p className="text-primary-foreground/80 mb-6 text-sm">Order for 4 or more and get 2 Coke PET bottles absolutely free. Best for match nights!</p>
            <Link href="/menu" className="text-white font-bold hover:underline inline-flex items-center gap-1 text-sm">
              Order Combo →
            </Link>
          </div>

          {/* Offer 3 */}
          <div className="relative p-8 rounded-3xl bg-card border border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[100px] -z-10 group-hover:bg-primary/20 transition-colors" />
            <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Free Dessert</h3>
            <p className="text-muted-foreground mb-6 text-sm">Orders above ₹499 get a free Choco Lava Cake. No coupon code required.</p>
            <Link href="/menu" className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-sm">
              View Menu →
            </Link>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          *Offers valid till Sunday midnight. Subject to availability.
        </p>
      </div>
    </section>
  );
}
