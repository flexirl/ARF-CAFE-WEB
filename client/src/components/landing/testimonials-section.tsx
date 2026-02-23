import { Star } from "lucide-react";
import Image from "next/image";

// Mock Testimonials
const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "B.Tech CSE, 3rd Year",
    content: "The 20-min delivery is literally a lifesaver during exams. The Peri Peri fries are always hot and crisp when they arrive. Highly recommended!",
    rating: 5,
    avatarId: 10,
  },
  {
    name: "Riya Patel",
    role: "BBA, 2nd Year",
    content: "Finally a cloud kitchen near KIIT that doesn't compromise on hygiene. The packaging is premium and the Tandoori Burger is just chef's kiss 🤌.",
    rating: 5,
    avatarId: 20,
  },
  {
    name: "Kabir Singh",
    role: "Hostel KP-6",
    content: "We ordered the group combo for match night. Food came right on time, piping hot, and the free Cokes made our day. Best late-night spot!",
    rating: 4,
    avatarId: 30,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Loved by <span className="text-gradient">KIITians</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Don&apos;t just take our word for it. Here&apos;s what your peers have to say about Kravings.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative">
              {/* Quotation mark decor */}
              <div className="absolute top-6 right-8 text-primary/10 font-serif text-6xl leading-none font-bold">&quot;</div>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`h-5 w-5 ${j < t.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base relative z-10">
                &quot;{t.content}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary border border-border">
                  <Image 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatarId}`} 
                    alt={t.name}
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
