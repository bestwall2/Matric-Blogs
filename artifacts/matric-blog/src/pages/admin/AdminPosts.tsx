import { Link } from "wouter";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useListAdminPosts, getListAdminPostsQueryKey, useDeletePost } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatDate } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminPosts() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const { data: posts, isLoading } = useListAdminPosts();
  const deletePost = useDeletePost();
  const qc = useQueryClient();

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">جاري التحقق...</div></div>;

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`هل تريد حذف المقال: ${title}؟`)) return;
    deletePost.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
          toast.success("تم حذف المقال");
        },
        onError: () => toast.error("فشل حذف المقال"),
      }
    );
  };

  const statusMap: Record<string, { label: string; cls: string }> = {
    published: { label: "منشور", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
    draft: { label: "مسودة", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    scheduled: { label: "مجدول", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-foreground">المقالات</h1>
              <p className="text-sm text-muted-foreground">{(posts ?? []).length} مقال</p>
            </div>
            <Link href="/admin/posts/new">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1.5" data-testid="button-new-post">
                <Plus className="w-4 h-4" /> مقال جديد
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4">
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))
              ) : (posts ?? []).length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">لا توجد مقالات بعد</div>
              ) : (
                (posts ?? []).map((post) => {
                  const s = statusMap[post.status] ?? { label: post.status, cls: "" };
                  return (
                    <div key={post.id} className="px-6 py-4 flex items-center gap-4" data-testid={`row-post-${post.id}`}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{post.title_ar || post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(post.published_at || post.created_at)}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${s.cls} shrink-0`}>{s.label}</Badge>
                      <div className="flex items-center gap-1 shrink-0">
                        {post.status === "published" && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground" data-testid={`button-view-${post.id}`}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button size="icon" variant="ghost" className="w-8 h-8 text-muted-foreground hover:text-foreground" data-testid={`button-edit-${post.id}`}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(post.id, post.title_ar || post.title)}
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
