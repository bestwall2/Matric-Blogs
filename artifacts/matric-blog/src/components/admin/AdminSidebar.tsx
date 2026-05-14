'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Tag, Sparkles, Search, LogOut, Rss, Menu, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/admin/posts", icon: FileText, label: "المقالات" },
  { href: "/admin/categories", icon: Tag, label: "الفئات" },
  { href: "/admin/ai-generate", icon: Sparkles, label: "توليد بالذكاء" },
  { href: "/admin/seo", icon: Search, label: "أدوات SEO" },
  { href: "/admin/youtube-to-blog", icon: Youtube, label: "يوتيوب → مقال" },
];

interface AdminSidebarProps {
  onSignOut?: () => void;
}

export default function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <Rss className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight">ماتريك<span className="text-red-400">بلوغ</span></span>
            <p className="text-[10px] text-white/40 leading-none mt-0.5">لوحة الإدارة</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
                active ? "bg-red-500/20 text-red-400" : "text-white/50 hover:bg-white/5 hover:text-white"
              )} data-testid={`nav-${href.split("/").pop()}`}>
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                  active ? "bg-red-500/20" : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {label}
                {active && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-red-400" />}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          data-testid="button-signout"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10 flex items-center justify-between px-4" dir="rtl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
            <Rss className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-sm text-white">ماتريك<span className="text-red-400">بلوغ</span></span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={cn(
        "md:hidden fixed top-14 right-0 bottom-0 z-40 w-64 bg-[#0e0e0e] border-l border-white/10 transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )} dir="rtl">
        <SidebarContent />
      </aside>
      <aside className="hidden md:flex w-56 bg-[#0e0e0e] border-l border-white/10 flex-col h-screen sticky top-0 shrink-0" dir="rtl">
        <SidebarContent />
      </aside>
    </>
  );
}
