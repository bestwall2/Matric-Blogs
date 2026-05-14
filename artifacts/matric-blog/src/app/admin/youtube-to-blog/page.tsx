'use client';

import { useState } from "react";
import { useCreatePost, getListAdminPostsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Youtube, Sparkles, Save, Eye, FileText, Loader2 } from "lucide-react";

type GeneratedPost = {
  title?: string;
  title_ar?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  reading_time?: number;
  seo_score?: number;
  seo_notes?: string[];
};

export default function YouTubeToBlogPage() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const createPost = useCreatePost();
  const qc = useQueryClient();

  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("Arabic");
  const [tone, setTone] = useState("Educational");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [transcriptLength, setTranscriptLength] = useState(0);
  const [preview, setPreview] = useState(false);

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground text-sm">جاري التحقق...</div>
    </div>
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/youtube-to-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, language, tone, instructions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل التوليد");
      setResult(data.post);
      setTranscriptLength(data.transcriptLength || 0);
      toast.success("تم تحويل الفيديو إلى مقال بنجاح");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!result) return;
    createPost.mutate(
      {
        data: {
          title: result.title || "مقال جديد",
          title_ar: result.title_ar || null,
          slug: result.slug || `yt-post-${Date.now()}`,
          excerpt: result.excerpt || null,
          content: result.content || "",
          content_ar: null,
          meta_title: result.meta_title || null,
          meta_description: result.meta_description || null,
          meta_keywords: result.meta_keywords || null,
          reading_time: result.reading_time || null,
          status: "draft",
          published_at: null,
          scheduled_at: null,
          featured_image: null,
          og_image: null,
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

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">يوتيوب إلى مقال</h1>
              <p className="text-sm text-muted-foreground">حوّل أي فيديو يوتيوب إلى مقال احترافي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">

                <div className="space-y-1.5">
                  <Label>رابط الفيديو</Label>
                  <div className="relative">
                    <Youtube className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-secondary border-border pr-9 text-left placeholder:text-right"
                      dir="ltr"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">يجب أن يحتوي الفيديو على ترجمة (Subtitles)</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>لغة المقال</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Arabic">العربية</SelectItem>
                        <SelectItem value="English">الإنجليزية</SelectItem>
                        <SelectItem value="Both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>الأسلوب</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Educational">تعليمي</SelectItem>
                        <SelectItem value="Conversational">محادثة</SelectItem>
                        <SelectItem value="Technical">تقني</SelectItem>
                        <SelectItem value="Journalistic">صحفي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>تعليمات إضافية (اختياري)</Label>
                  <Input
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="مثال: ركز على الجمهور المغربي، أضف أمثلة عملية..."
                    className="bg-secondary border-border text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold rounded-xl transition-all"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> جاري التحليل والتوليد...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> تحويل إلى مقال</>
                )}
              </button>

              {/* Steps indicator */}
              {loading && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
                  <p className="text-xs font-bold text-foreground mb-3">ما يحدث الآن:</p>
                  {[
                    "جلب النص من يوتيوب...",
                    "تحليل المحتوى بالذكاء الاصطناعي...",
                    "كتابة المقال وتحسين SEO...",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin text-primary shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Result */}
            {result && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h2 className="font-bold text-foreground">المقال المُولَّد</h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreview(!preview)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> {preview ? "كود" : "معاينة"}
                      </button>
                      <button
                        onClick={handleSaveDraft}
                        disabled={createPost.isPending}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" /> حفظ مسودة
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-3 mb-4">
                    {transcriptLength > 0 && (
                      <div className="text-xs bg-secondary rounded-lg px-3 py-1.5 text-muted-foreground">
                        📝 {transcriptLength.toLocaleString()} حرف في النص
                      </div>
                    )}
                    {result.reading_time && (
                      <div className="text-xs bg-secondary rounded-lg px-3 py-1.5 text-muted-foreground">
                        ⏱ {result.reading_time} دقائق قراءة
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-foreground mb-1">{result.title_ar || result.title}</h3>
                  {result.excerpt && <p className="text-xs text-muted-foreground mb-3">{result.excerpt}</p>}

                  {result.seo_score && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-muted-foreground">SEO:</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${result.seo_score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary">{result.seo_score}%</span>
                    </div>
                  )}

                  <div className="max-h-72 overflow-auto text-xs border border-border rounded-lg p-3 bg-secondary">
                    {preview ? (
                      <div className="article-html prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.content || "" }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-muted-foreground font-mono">{result.content?.slice(0, 1200)}...</pre>
                    )}
                  </div>

                  {result.seo_notes && result.seo_notes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-foreground mb-1">ملاحظات SEO:</p>
                      {result.seo_notes.map((n, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {n}</p>
                      ))}
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
