'use client';

import { useState } from "react";
import { useAiGeneratePost, useCreatePost, getListAdminPostsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Sparkles, Save, Eye, Image as ImageIcon, Loader2, Download } from "lucide-react";

type GeneratedPost = {
  title?: string;
  title_ar?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  content_ar?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  reading_time?: number;
  seo_score?: number;
  seo_notes?: string[];
};

export default function AdminAiGenerate() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const generate = useAiGeneratePost();
  const createPost = useCreatePost();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    topic: "",
    language: "Arabic" as "Arabic" | "English" | "Both",
    type: "Guide" as "Guide" | "News" | "Review" | "Comparison" | "HowTo",
    length: "medium" as "short" | "medium" | "long",
    tone: "Educational" as "Educational" | "Conversational" | "Technical" | "Journalistic",
    keyword: "",
    includeFAQ: false,
    includeTOC: true,
    instructions: "",
  });

  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [preview, setPreview] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground text-sm">جاري التحقق...</div>
    </div>
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedImage(null);
    generate.mutate(
      { data: form },
      {
        onSuccess: (res) => {
          setResult(res.data as GeneratedPost);
          toast.success("تم توليد المقال بنجاح");
        },
        onError: (err) => toast.error("فشل التوليد: " + (err as Error).message),
      }
    );
  };

  const handleGenerateImage = async () => {
    if (!result) return;
    setImageLoading(true);
    try {
      const prompt = `High quality blog featured image for an article about: ${result.title_ar || result.title || form.topic}. Professional, modern, vibrant, editorial style photography. No text or watermarks.`;
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل توليد الصورة");
      setGeneratedImage(data.image);
      toast.success("تم توليد الصورة بنجاح");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!result) return;
    createPost.mutate(
      {
        data: {
          title: result.title || "مقال جديد",
          title_ar: result.title_ar || null,
          slug: result.slug || `post-${Date.now()}`,
          excerpt: result.excerpt || null,
          content: result.content || "",
          content_ar: result.content_ar || null,
          meta_title: result.meta_title || null,
          meta_description: result.meta_description || null,
          meta_keywords: result.meta_keywords || null,
          reading_time: result.reading_time || null,
          status: "draft",
          published_at: null,
          scheduled_at: null,
          featured_image: generatedImage || null,
          og_image: generatedImage || null,
          canonical_url: null,
          robots_meta: null,
          schema_type: null,
          category_id: null,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
          toast.success("تم حفظ المقال كمسودة");
        },
        onError: () => toast.error("فشل الحفظ"),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-6 max-w-4xl">
          <h1 className="text-2xl font-black text-foreground mb-6">توليد محتوى بالذكاء الاصطناعي</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-4" data-testid="form-ai-generate">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label>الموضوع</Label>
                  <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required className="bg-secondary border-border text-right" placeholder="مثال: أفضل طرق مشاهدة دوري أبطال أوروبا" data-testid="input-topic" />
                </div>
                <div className="space-y-1.5">
                  <Label>الكلمة المفتاحية</Label>
                  <Input value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} required className="bg-secondary border-border text-right" data-testid="input-keyword" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>اللغة</Label>
                    <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v as typeof form.language })}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="select-language"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Arabic">العربية</SelectItem>
                        <SelectItem value="English">الإنجليزية</SelectItem>
                        <SelectItem value="Both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>نوع المقال</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as typeof form.type })}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="select-type"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Guide">دليل</SelectItem>
                        <SelectItem value="News">خبر</SelectItem>
                        <SelectItem value="Review">مراجعة</SelectItem>
                        <SelectItem value="Comparison">مقارنة</SelectItem>
                        <SelectItem value="HowTo">كيفية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>الطول</Label>
                    <Select value={form.length} onValueChange={(v) => setForm({ ...form, length: v as typeof form.length })}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="select-length"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="short">قصير (~500)</SelectItem>
                        <SelectItem value="medium">متوسط (~1000)</SelectItem>
                        <SelectItem value="long">طويل (~2000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>الأسلوب</Label>
                    <Select value={form.tone} onValueChange={(v) => setForm({ ...form, tone: v as typeof form.tone })}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="select-tone"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Educational">تعليمي</SelectItem>
                        <SelectItem value="Conversational">محادثة</SelectItem>
                        <SelectItem value="Technical">تقني</SelectItem>
                        <SelectItem value="Journalistic">صحفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={form.includeTOC} onCheckedChange={(v) => setForm({ ...form, includeTOC: !!v })} data-testid="check-toc" />
                    <span className="text-sm">فهرس المحتوى</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={form.includeFAQ} onCheckedChange={(v) => setForm({ ...form, includeFAQ: !!v })} data-testid="check-faq" />
                    <span className="text-sm">أسئلة وأجوبة</span>
                  </label>
                </div>
                <div className="space-y-1.5">
                  <Label>تعليمات إضافية (اختياري)</Label>
                  <Input value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="bg-secondary border-border text-right" placeholder="مثال: ركز على جمهور مغربي" data-testid="input-instructions" />
                </div>
              </div>
              <Button type="submit" disabled={generate.isPending} className="w-full bg-primary hover:bg-primary/90 text-white gap-2" data-testid="button-generate">
                <Sparkles className="w-4 h-4" />
                {generate.isPending ? "جاري التوليد..." : "توليد المقال"}
              </Button>
            </form>

            {/* Result */}
            {result && (
              <div className="space-y-4">
                {/* Article result */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-foreground">النتيجة</h2>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setPreview(!preview)} className="gap-1 border-border text-xs" data-testid="button-preview">
                        <Eye className="w-3.5 h-3.5" /> {preview ? "كود" : "معاينة"}
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1 text-xs" onClick={handleSaveDraft} disabled={createPost.isPending} data-testid="button-save-draft">
                        <Save className="w-3.5 h-3.5" /> حفظ مسودة
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{result.title_ar || result.title}</h3>
                  {result.excerpt && <p className="text-xs text-muted-foreground mb-3">{result.excerpt}</p>}
                  {result.seo_score && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-xs text-muted-foreground">SEO:</div>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${result.seo_score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary">{result.seo_score}%</span>
                    </div>
                  )}
                  <div className="max-h-64 overflow-auto text-xs border border-border rounded-lg p-3 bg-secondary font-mono">
                    {preview ? (
                      <div className="article-html" dangerouslySetInnerHTML={{ __html: result.content || "" }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-muted-foreground">{result.content?.slice(0, 1000)}...</pre>
                    )}
                  </div>
                  {result.seo_notes && result.seo_notes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-foreground mb-1">ملاحظات SEO:</p>
                      <ul className="space-y-0.5">
                        {result.seo_notes.map((note, i) => (
                          <li key={i} className="text-xs text-muted-foreground">• {note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Image generation */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      الصورة البارزة
                    </h2>
                    <Button
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={imageLoading}
                      className="bg-primary hover:bg-primary/90 text-white gap-1.5 text-xs"
                      data-testid="button-generate-image"
                    >
                      {imageLoading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> جاري التوليد...</>
                      ) : (
                        <><Sparkles className="w-3.5 h-3.5" /> {generatedImage ? "إعادة التوليد" : "توليد صورة"}</>
                      )}
                    </Button>
                  </div>

                  {imageLoading && (
                    <div className="w-full aspect-video rounded-lg bg-secondary border border-border flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="text-xs text-muted-foreground">جاري توليد الصورة بالذكاء الاصطناعي...</p>
                    </div>
                  )}

                  {generatedImage && !imageLoading && (
                    <div className="space-y-2">
                      <Image
                        src={generatedImage}
                        alt="Generated featured image"
                        width={800}
                        height={450}
                        className="w-full aspect-video object-cover rounded-lg border border-border"
                      />
                      <a
                        href={generatedImage}
                        download="featured-image.png"
                        className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        تحميل الصورة
                      </a>
                      <p className="text-[10px] text-muted-foreground text-center">
                        ستُحفظ الصورة تلقائياً مع المقال عند الضغط على "حفظ مسودة"
                      </p>
                    </div>
                  )}

                  {!generatedImage && !imageLoading && (
                    <div className="w-full aspect-video rounded-lg bg-secondary border border-dashed border-border flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground">اضغط على "توليد صورة" لإنشاء صورة بارزة للمقال</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
