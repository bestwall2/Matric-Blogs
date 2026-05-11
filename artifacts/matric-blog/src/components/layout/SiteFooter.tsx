import { Link } from "wouter";
import { Rss, Twitter, Facebook, Youtube } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Rss className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-black text-foreground">ماتريك<span className="text-primary">بلوغ</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              موقعك المتخصص في أخبار كرة القدم والبث المباشر والتقنية. نقدم المحتوى العربي الأصيل لجمهور المغرب والوطن العربي.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" aria-label="Youtube" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground mb-3">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/blog", label: "المدونة" },
                { href: "/about", label: "من نحن" },
                { href: "/contact", label: "تواصل معنا" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground mb-3">قانوني</h3>
            <ul className="space-y-2">
              {[
                { href: "/privacy", label: "سياسة الخصوصية" },
                { href: "/terms", label: "شروط الاستخدام" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {year} ماتريكبلوغ. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
