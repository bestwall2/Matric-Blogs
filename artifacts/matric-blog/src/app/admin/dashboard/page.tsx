'use client';

import { useState, useEffect } from "react";
import { FileText, Tag, Eye, Plus, TrendingUp, Clock, ArrowUpRight, PenLine, ShieldCheck, ScanLine, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useGetPostsStats, useListAdminPosts } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AiAssistant from "@/components/admin/AiAssistant";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const { data: stats, isLoading: statsLoading } = useGetPostsStats();
  const { data: posts, isLoading: postsLoading } = useListAdminPosts();

  if (authLoading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex items-center gap-2 text-white/30 text-sm">
        <div className="w-4 h-4 border-2 border-red-500/50 border-t-red-500 rounded-full animate-spin" />
        جاري التحقق...
      </div>
    </div>
  );

  const recentPosts = (posts ?? []).slice(0, 5);

  const STAT_CARDS = [
    { label: "المقالات", value: stats?.articles ?? 0, icon: FileText, color: "from-red-500/20 to-rose-500/5", iconColor: "text-red-400" },
    { label: "الفئات", value: stats?.categories ?? 0, icon: Tag, color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
    { label: "المشاهدات", value: stats?.views ?? 0, icon: Eye, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#080808] flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-white/30 uppercase tracking-widest font-mono">Admin Panel</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">لوحة التحكم</h1>
              <p className="text-sm text-white/40 mt-1">مرحباً بك في إدارة ماتريكبلوغ</p>
            </div>
            <Link href="/admin/posts/new">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-500/25 hover:scale-105 active:scale-95" data-testid="button-new-post">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">مقال جديد</span>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {STAT_CARDS.map(({ label, value, icon: Icon, color, iconColor }) => (
              <div key={label} className={`relative rounded-2xl bg-gradient-to-br ${color} border border-white/[0.06] p-4 md:p-6 overflow-hidden`} data-testid={`stat-${label}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs md:text-sm text-white/40 font-medium">{label}</span>
                  <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                </div>
                {statsLoading ? (
                  <Skeleton className="h-7 w-14 bg-white/10" />
                ) : (
                  <p className="text-2xl md:text-4xl font-black text-white tabular-nums">{value.toLocaleString("ar")}</p>
                )}
                <TrendingUp className="absolute bottom-3 left-3 w-16 h-16 text-white/[0.03] stroke-1" />
              </div>
            ))}
          </div>

          {/* AI Audit Card */}
          <Link href="/admin/seo">
            <div className="group rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 md:p-5 mb-4 hover:border-emerald-500/40 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">تحليل AdSense</h3>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">AI</span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">فحص آلي للموقع — موجود في أدوات SEO</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/30">
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>يفحص 7+ صفحات</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-white/30" />
                <h2 className="font-bold text-white text-sm md:text-base">آخر المقالات</h2>
              </div>
              <Link href="/admin/posts">
                <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
                  عرض الكل <ArrowUpRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {postsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 md:px-6 py-4 flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-lg bg-white/5 shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-2/3 mb-2 bg-white/5" />
                      <Skeleton className="h-3 w-1/4 bg-white/5" />
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full bg-white/5" />
                  </div>
                ))
              ) : recentPosts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <PenLine className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-sm text-white/30">لا توجد مقالات بعد</p>
                </div>
              ) : (
                recentPosts.map((post, i) => (
                  <div key={post.id} className="px-5 md:px-6 py-3.5 flex items-center gap-3 md:gap-4 hover:bg-white/[0.02] transition-colors group" data-testid={`row-post-${post.id}`}>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <span className="text-xs text-white/30 font-mono">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white/80 truncate group-hover:text-white transition-colors">{post.title_ar || post.title}</p>
                      <p className="text-xs text-white/30 mt-0.5">{formatDate(post.published_at || post.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PostStatusBadge status={post.status} />
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <button className="hidden sm:block text-xs text-white/30 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-all">تعديل</button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <AiAssistant page="dashboard" />
    </div>
  );
}

function PostStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    published: { label: "منشور", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    draft: { label: "مسودة", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    scheduled: { label: "مجدول", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };
  const s = map[status] ?? { label: status, className: "bg-white/5 text-white/40 border-white/10" };
  return <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.className}`}>{s.label}</Badge>;
}
