import { FileText, Tag, Eye, Plus } from "lucide-react";
import { Link } from "wouter";
import { useGetPostsStats, useListAdminPosts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const { data: stats, isLoading: statsLoading } = useGetPostsStats();
  const { data: posts, isLoading: postsLoading } = useListAdminPosts();

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">جاري التحقق...</div></div>;

  const recentPosts = (posts ?? []).slice(0, 5);

  const STAT_CARDS = [
    { label: "المقالات", value: stats?.articles ?? 0, icon: FileText, color: "text-primary" },
    { label: "الفئات", value: stats?.categories ?? 0, icon: Tag, color: "text-blue-400" },
    { label: "المشاهدات", value: stats?.views ?? 0, icon: Eye, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-foreground">لوحة التحكم</h1>
              <p className="text-sm text-muted-foreground mt-0.5">مرحباً بك في إدارة ماتريكبلوغ</p>
            </div>
            <Link href="/admin/posts/new">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1.5" data-testid="button-new-post">
                <Plus className="w-4 h-4" /> مقال جديد
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-6" data-testid={`stat-${label}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-3xl font-black text-foreground">{value.toLocaleString("ar")}</p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">آخر المقالات</h2>
              <Link href="/admin/posts">
                <Button variant="ghost" size="sm" className="text-primary text-xs">عرض الكل</Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))
              ) : recentPosts.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">لا توجد مقالات بعد</div>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="px-6 py-4 flex items-center justify-between" data-testid={`row-post-${post.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{post.title_ar || post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(post.published_at || post.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 mr-4">
                      <PostStatusBadge status={post.status} />
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">تعديل</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    published: { label: "منشور", className: "bg-green-500/10 text-green-400 border-green-500/20" },
    draft: { label: "مسودة", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    scheduled: { label: "مجدول", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };
  const s = map[status] ?? { label: status, className: "bg-secondary text-muted-foreground" };
  return <Badge variant="outline" className={`text-xs ${s.className}`}>{s.label}</Badge>;
}
