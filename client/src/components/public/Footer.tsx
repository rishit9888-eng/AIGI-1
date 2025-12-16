import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from 'wouter';

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Verify Certificate", href: "/verify" },
  { label: "Gallery", href: "/gallery" },
  { label: "Research", href: "/research" },
  { label: "Education", href: "/education" },
  { label: "Contact", href: "/contact" },
];

const branches = [
  "VADODARA (Head Office)",
  "Ludhiana",
  "Panchkula",
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border" data-testid="footer-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="AIGI" className="h-8 w-8" />
              <span className="font-serif text-xl font-semibold">AIGI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              All India Gemological Institute - One of India's largest independent gemological laboratories since 2004.
            </p>
            <p className="text-xs text-muted-foreground">
              Trusted by diamond manufacturers, dealers, and jewelers nationwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Our Locations</h4>
            <ul className="space-y-2">
              {branches.map((branch) => (
                <li key={branch} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {branch}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +91 9872595709
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                aigilabdelhi@gmail.com
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                Operating Hours: Mon-Sat, 10 AM - 6 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            2024 AIGI - All India Gemological Institute. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
