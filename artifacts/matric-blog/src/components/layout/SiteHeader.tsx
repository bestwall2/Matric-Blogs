'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/blog", label: "المدونة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass glass-border py-2" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" data-testid="link-logo" className="flex items-center gap-1.5 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Rss className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-foreground">
            ماتريك<span className="text-primary">بلوغ</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 right-2 left-2 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden" data-testid="button-menu-mobile">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-border p-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-bold text-foreground">القائمة</span>
                <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    data-testid={`link-mobile-${link.href.replace("/", "") || "home"}`}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
