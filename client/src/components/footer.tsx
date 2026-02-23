import Link from "next/link";
import { ChefHat, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-lg leading-none tracking-tight">KRAVINGS</span>
                <span className="text-primary text-[0.65rem] font-bold tracking-widest leading-none mt-0.5">BY ARF CAFE</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Premium cloud kitchen serving hot, hygiene-first, and chef-crafted meals exclusively for KIIT students and nearby residents.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors text-sm">Our Menu</Link></li>
              <li><Link href="/#offers" className="text-muted-foreground hover:text-primary transition-colors text-sm">Student Offers</Link></li>
              <li><Link href="/track-order" className="text-muted-foreground hover:text-primary transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Near KIIT University, Patia, Bhubaneswar, Odisha 751024</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">11:00 AM – 1:00 AM (Daily)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kravings by ARF Cafe. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <span className="text-red-500">♥</span> for KIITians
          </p>
        </div>
      </div>
    </footer>
  );
}
