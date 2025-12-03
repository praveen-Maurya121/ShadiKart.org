import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-yellow-50/30 to-yellow-50/50 border-t border-yellow-100/50 mt-auto">
      <div className="page-shell-premium">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="/" className="logo-shine text-2xl md:text-3xl font-display font-extrabold tracking-tight inline-block">
                Shadikart
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your trusted partner for creating unforgettable wedding celebrations. We make your dream wedding come true.
              </p>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium Wedding Services</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/planner" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    AI Planner
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Our Services</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-muted-foreground text-sm">Wedding Planning</span>
                </li>
                <li>
                  <span className="text-muted-foreground text-sm">Package Customization</span>
                </li>
                <li>
                  <span className="text-muted-foreground text-sm">Guest Management</span>
                </li>
                <li>
                  <span className="text-muted-foreground text-sm">Event Coordination</span>
                </li>
                <li>
                  <span className="text-muted-foreground text-sm">24/7 Support</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@shadikart.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    support@shadikart.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    +91 123 456 7890
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    India
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-yellow-100/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © {new Date().getFullYear()} Shadikart. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-6 text-sm">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
