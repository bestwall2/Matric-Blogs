'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useCreatePost, useGetPostById, getGetPostByIdQueryKey,
  useUpdatePost, useListCategories, getListAdminPostsQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { computeSeoScore } from "@/lib/seo-score";
import { slugify } from "@/lib/slug";
import { getApiBase, cn } from "@/lib/utils";
import { Upload, CheckCircle, XCircle, Save, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostForm {
  title: string;
  title_ar: string;
  slug: string;
  excerpt: string;
  content: string;
  content_ar: string;
  featured_image: string;
  category_id: string;
  status: "draft" | "published" | "scheduled";
  published_at: string;
  scheduled_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  canonical_url: string;
  robots_meta: string;
  schema_type: string;
  reading_time: string;
}

const EMPTY: PostForm = {
  title: "", title_ar: "", slug: "", excerpt: "",
  content: "", content_ar: "", featured_image: "",
  category_id: "", status: "draft", published_at: "", scheduled_at: "",
  meta_title: "", meta_description: "", meta_keywords: "",
  og_image: "", canonical_url: "", robots_meta: "", schema_type: "", reading_time: "",
};

export default function PostEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  
  const { loading: authLoading, signOut } = useAdminAuth();
  const isNew = !id;

  const { data: existingPost, isLoading: postLoading } = useGetPostById(id ?? "", {
    query: { enabled: !!id, queryKey: getGetPostByIdQueryKey(id ?? "") },
  });
  const { data: categories } = useListCategories();

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const qc = useQueryClient();

  const [form, setForm] = useState<PostForm>(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title ?? "",
        title_ar: existingPost.title_ar ?? "",
        slug: existingPost.slug ?? "",
        excerpt: existingPost.excerpt ?? "",
        content: existingPost.content ?? "",
        content_ar: existingPost.content_ar ?? "",
        featured_image: existingPost.featured_image ?? "",
        category_id: existingPost.category_id ?? "",
        status: (existingPost.status as PostForm["status"]) ?? "draft",
        published_at: existingPost.published_at?.slice(0, 16) ?? "",
        scheduled_at: existingPost.scheduled_at?.slice(0, 16) ?? "",
        meta_title: existingPost.meta_title ?? "",
        meta_description: existingPost.meta_description ?? "",
        meta_keywords: (existingPost.meta_keywords ?? []).join(", "),
        og_image: existingPost.og_image ?? "",
        canonical_url: existingPost.canonical_url ?? "",
        robots_meta: existingPost.robots_meta ?? "",
        schema_type: existingPost.schema_type ?? "",
        reading_time: existingPost.reading_time?.toString() ?? "",
      });
    }
  }, [existingPost]);

  const f = (field: keyof PostForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: val,
      ...(field === "title" && isNew ? { slug: slugify(val), meta_title: val } : {}),
    }));
  };

  const score = computeSeoScore({
    title: form.title,
    metaTitle: form.meta_title,
    metaDescription: form.meta_description,
    focusKeyword: form.meta_keywords.split(",")[0]?.trim() ?? "",
    htmlContent: form.content,
    featuredImage: form.featured_image || null,
  });

  const buildData = () => ({
    title: form.title,
    title_ar: form.title_ar || null,
    slug: form.slug || slugify(form.title),
    excerpt: form.excerpt || null,
    content: form.content,
    content_ar: form.content_ar || null,
    featured_image: form.featured_image || null,
    category_id: form.category_id || null,
    status: form.status,
    published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
    scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
    meta_title: form.meta_title || null,
    meta_description: form.meta_description || null,
    meta_keywords: form.meta_keywords ? form.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean) : null,
    og_image: form.og_image || null,
    canonical_url: form.canonical_url || null,
    robots_meta: form.robots_meta || null,
    schema_type: form.schema_type || null,
    reading_time: form.reading_time ? parseInt(form.reading_time) : null,
  });

  const handleSave = () => {
    if (!form.title) { toast.error("العنوان مطلوب"); return; }
    if (isNew) {
      createPost.mutate(
        { data: buildData() },
        {
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
            toast.success("تم إنشاء المقال");
            router.push("/admin/posts");
          },
          onError: () => toast.error("فشل الإنشاء"),
        }
      );
    } else {
      updatePost.mutate(
        { id: id!, data: buildData() },
        {
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
            toast.success("تم تحديث المقال");
          },
          onError: () => toast.error("فشل التحديث"),
        }
      );
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { createClient: makeClient } = await import("@/lib/supabase");
      const { data: sessionData } = await makeClient().auth.getSession();
      const token = sessionData.session?.access_token ?? "";
      const res = await fetch(`${getApiBase()}/upload`, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json() as { url?: string; error?: string };
      if (json.url) {
        setForm((prev) => ({ ...prev, featured_image: json.url! }));
        toast.success("تم رفع الصورة");
      } else {
        toast.error(json.error || "فشل الرفع");
      }
    } catch {
      toast.error("فشل الرفع");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">جاري التحقق...</div></div>;
  if (!isNew && postLoading) return (
    <div className="min-h-screen bg-background flex"><AdminSidebar onSignOut={signOut} /><div className="flex-1 p-6"><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-64 w-full" /></div></div>
  );

  const isSaving = createPost.isPending || updatePost.isPending;

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-foreground">{isNew ? "مقال جديد" : "تعديل المقال"}</h1>
              {!isNew && existingPost && (
                <p className="text-sm text-muted-foreground">{existingPost.title_ar || existingPost.title}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isNew && form.status === "published" && (
                <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline" className="gap-1 border-border text-xs" data-testid="button-view-post">
                    <Eye className="w-3.5 h-3.5" /> عرض
                  </Button>
                </a>
              )}
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1.5" onClick={handleSave} disabled={isSaving} data-testid="button-save-post">
                <Save className="w-4 h-4" />
                {isSaving ? "جاري الحفظ..." : isNew ? "إنشاء" : "حفظ"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">العنوان الرئيسي</Label>
                  <Input value={form.title} onChange={f("title")} className="bg-secondary border-border text-right font-bold text-base" placeholder="عنوان المقال" data-testid="input-title" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">الرابط (slug)</Label>
                  <Input value={form.slug} onChange={f("slug")} className="bg-secondary border-border" dir="ltr" data-testid="input-slug" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">المقتطف</Label>
                  <Textarea value={form.excerpt} onChange={f("excerpt")} className="bg-secondary border-border text-right text-sm resize-none" rows={2} data-testid="textarea-excerpt" />
                </div>
              </div>

              <Tabs defaultValue="content" className="rounded-xl border border-border bg-card overflow-hidden">
                <TabsList className="w-full rounded-none border-b border-border bg-card p-1 gap-1">
                  <TabsTrigger value="content" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">المحتوى</TabsTrigger>
                  <TabsTrigger value="arabic" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">النسخة العربية</TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">SEO</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="p-4">
                  <TiptapEditor value={form.content} onChange={(val) => setForm((p) => ({ ...p, content: val }))} placeholder="اكتب محتوى المقال هنا..." />
                </TabsContent>
                <TabsContent value="arabic" className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">العنوان بالعربية</Label>
                    <Input value={form.title_ar} onChange={f("title_ar")} className="bg-secondary border-border text-right" data-testid="input-title-ar" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">المحتوى العربي</Label>
                    <TiptapEditor value={form.content_ar} onChange={(val) => setForm((p) => ({ ...p, content_ar: val }))} placeholder="اكتب المحتوى العربي..." />
                  </div>
                </TabsContent>
                <TabsContent value="seo" className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meta Title</Label>
                    <Input value={form.meta_title} onChange={f("meta_title")} className="bg-secondary border-border text-sm" data-testid="input-meta-title" />
                    <p className="text-xs text-muted-foreground">{form.meta_title.length}/60</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meta Description</Label>
                    <Textarea value={form.meta_description} onChange={f("meta_description")} className="bg-secondary border-border text-sm resize-none" rows={3} data-testid="textarea-meta-desc" />
                    <p className="text-xs text-muted-foreground">{form.meta_description.length}/160</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                    <Input value={form.meta_keywords} onChange={f("meta_keywords")} className="bg-secondary border-border text-sm" data-testid="input-meta-keywords" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Canonical URL</Label>
                    <Input value={form.canonical_url} onChange={f("canonical_url")} className="bg-secondary border-border text-sm" dir="ltr" data-testid="input-canonical" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Robots Meta</Label>
                    <Input value={form.robots_meta} onChange={f("robots_meta")} className="bg-secondary border-border text-sm" placeholder="index, follow" data-testid="input-robots" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <Label className="text-xs font-bold text-foreground">الحالة والنشر</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as PostForm["status"] }))}>
                  <SelectTrigger className="bg-secondary border-border text-sm" data-testid="select-status"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="scheduled">مجدول</SelectItem>
                  </SelectContent>
                </Select>
                {form.status === "published" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">تاريخ النشر</Label>
                    <Input type="datetime-local" value={form.published_at} onChange={f("published_at")} className="bg-secondary border-border text-sm" data-testid="input-published-at" />
                  </div>
                )}
                {form.status === "scheduled" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">تاريخ الجدولة</Label>
                    <Input type="datetime-local" value={form.scheduled_at} onChange={f("scheduled_at")} className="bg-secondary border-border text-sm" data-testid="input-scheduled-at" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs">الفئة</Label>
                  <Select value={form.category_id || "none"} onValueChange={(v) => setForm((p) => ({ ...p, category_id: v === "none" ? "" : v }))}>
                    <SelectTrigger className="bg-secondary border-border text-sm" data-testid="select-category"><SelectValue placeholder="اختر فئة" /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="none">بدون فئة</SelectItem>
                      {(categories ?? []).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name_ar || cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">وقت القراءة (دقيقة)</Label>
                  <Input type="number" min="1" value={form.reading_time} onChange={f("reading_time")} className="bg-secondary border-border text-sm" data-testid="input-reading-time" />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <Label className="text-xs font-bold text-foreground">الصورة البارزة</Label>
                {form.featured_image && (
                  <img src={form.featured_image} alt="" className="w-full h-32 object-cover rounded-lg" />
                )}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/40 transition-colors bg-secondary">
                  <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">{uploading ? "جاري الرفع..." : "رفع صورة"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} data-testid="input-image-upload" />
                </label>
                {form.featured_image && (
                  <Input value={form.featured_image} onChange={f("featured_image")} className="bg-secondary border-border text-xs" dir="ltr" data-testid="input-image-url" />
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs font-bold text-foreground">نتيجة SEO</Label>
                  <div className={cn(
                    "text-lg font-black",
                    score.score >= 70 ? "text-green-400" : score.score >= 40 ? "text-yellow-400" : "text-red-400"
                  )}>
                    {score.score}%
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
                  <div
                    className={cn("h-full rounded-full transition-all", score.score >= 70 ? "bg-green-400" : score.score >= 40 ? "bg-yellow-400" : "bg-primary")}
                    style={{ width: `${score.score}%` }}
                  />
                </div>
                <div className="space-y-1.5">
                  {score.breakdown.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      {item.ok ? <CheckCircle className="w-3 h-3 text-green-400 shrink-0" /> : <XCircle className="w-3 h-3 text-red-400 shrink-0" />}
                      <span className={cn("text-xs", item.ok ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
