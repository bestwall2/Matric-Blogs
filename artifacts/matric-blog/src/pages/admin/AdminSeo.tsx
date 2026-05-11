import { useState } from "react";
import { useAiImproveContent } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { computeSeoScore } from "@/lib/seo-score";
import { toast } from "sonner";
import { Wand2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSeo() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const improveContent = useAiImproveContent();

  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [instruction, setInstruction] = useState("");
  const [improved, setImproved] = useState<{ content: string; seo_notes: string[] } | null>(null);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">جاري التحقق...</div></div>;

  const score = content ? computeSeoScore({ title, metaTitle, metaDescription: metaDesc, focusKeyword: keyword, htmlContent: content }) : null;

  const handleImprove = () => {
    if (!content) { toast.error("أدخل محتوى HTML"); return; }
    improveContent.mutate(
      { data: { html: content, focusKeyword: keyword || undefined, instruction: instruction || undefined } },
      {
        onSuccess: (res) => {
          const data = res.data as { content?: string; seo_notes?: string[] };
          setImproved({ content: data.content ?? "", seo_notes: data.seo_notes ?? [] });
          toast.success("تم تحسين المحتوى");
        },
        onError: () => toast.error("فشل التحسين"),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl">
          <h1 className="text-2xl font-black text-foreground mb-6">أدوات SEO</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h2 className="font-bold text-foreground text-sm">تحليل SEO</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">عنوان المقال</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border text-right text-sm" data-testid="input-seo-title" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">الكلمة المفتاحية</Label>
                    <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-secondary border-border text-right text-sm" data-testid="input-seo-keyword" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meta Title</Label>
                    <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="bg-secondary border-border text-sm" data-testid="input-meta-title" />
                    <p className="text-xs text-muted-foreground">{metaTitle.length}/60</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meta Description</Label>
                    <Input value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="bg-secondary border-border text-sm" data-testid="input-meta-desc" />
                    <p className="text-xs text-muted-foreground">{metaDesc.length}/160</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">محتوى HTML</Label>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="bg-secondary border-border font-mono text-xs min-h-32" dir="ltr" placeholder="<h2>...</h2><p>...</p>" data-testid="textarea-content" />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h2 className="font-bold text-foreground text-sm">تحسين بالذكاء الاصطناعي</h2>
                <div className="space-y-1.5">
                  <Label className="text-xs">تعليمات إضافية</Label>
                  <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} className="bg-secondary border-border text-right text-sm" placeholder="مثال: ركز على جمهور مغربي" data-testid="input-instruction" />
                </div>
                <Button onClick={handleImprove} disabled={improveContent.isPending || !content} className="w-full bg-primary hover:bg-primary/90 text-white gap-2" data-testid="button-improve">
                  <Wand2 className="w-4 h-4" />
                  {improveContent.isPending ? "جاري التحسين..." : "تحسين المحتوى"}
                </Button>
                {improved && (
                  <div className="border border-border rounded-lg p-3 bg-secondary/50">
                    <p className="text-xs font-bold text-foreground mb-2">المحتوى المحسن:</p>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-40 overflow-auto">{improved.content.slice(0, 500)}...</pre>
                    {improved.seo_notes.length > 0 && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-xs font-bold text-foreground mb-1">ملاحظات:</p>
                        {improved.seo_notes.map((n, i) => <p key={i} className="text-xs text-muted-foreground">• {n}</p>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              {score ? (
                <div className="rounded-xl border border-border bg-card p-5 sticky top-6">
                  <h2 className="font-bold text-foreground text-sm mb-4">نتيجة SEO</h2>
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(0 0% 10%)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e63946" strokeWidth="3"
                        strokeDasharray={`${score.score} 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-foreground">{score.score}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {score.breakdown.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        {item.ok ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                        <span className={cn("text-xs", item.ok ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
                  أدخل محتوى لتحليل SEO
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
