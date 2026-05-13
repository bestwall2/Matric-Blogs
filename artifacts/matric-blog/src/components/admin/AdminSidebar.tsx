'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Tag, Sparkles, Search, LogOut, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/admin/posts", icon: FileText, label: "المقالات" },
  { href: "/admin/categories", icon: Tag, label: "الفئات" },
  { href: "/admin/ai-generate", icon: Sparkles, label: "توليد بالذكاء الاصطناعي" },
  { href: "/admin/seo", icon: Search, label: "أدوات SEO" },
];

interface AdminSidebarProps {
  onSignOut?: () => void;
}

export default function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-card border-l border-border flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Rss className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-sm text-foreground">ماتريك<span className="text-primary">بلوغ</span></span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">لوحة الإدارة</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                pathname?.startsWith(href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              data-testid={`nav-${href.split("/").pop()}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground text-sm"
          data-testid="button-signout"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
}
