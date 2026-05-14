'use client';

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
import {
  Wand2, CheckCircle, XCircle, ShieldCheck, ScanLine,
  Loader2, Radio, RefreshCw, Bug, AlertTriangle, CheckCircle2, FileText
} from "lucide-react";
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

  // AdSense audit state
  const [activeTab, setActiveTab] = useState<"seo" | "adsense">("seo");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const siteUrl = window.location.origin;
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: siteUrl }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Analysis failed");
      setAnalysisResult(json.data);
      toast.success("اكتمل تحليل AdSense");
    } catch (err: any) {
      setAnalysisError(err.message || "فشل التحليل");
      toast.error("فشل تحليل AdSense");
    } finally {
      setAnalysisLoading(false);
    }
  };

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
      <div className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-6 max-w-5xl">

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-card border border-border rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("seo")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "seo" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Wand2 className="w-4 h-4" />
              أدوات SEO
            </button>
            <button
              onClick={() => setActiveTab("adsense")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "adsense" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              تحليل AdSense
            </button>
          </div>

          {activeTab === "seo" && (
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
          )}

          {activeTab === "adsense" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-foreground text-sm">تحليل AdSense للموقع</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">فحص آلي لاكتشاف مشاكل AdSense و SEO والمحتوى</p>
                  </div>
                  <Button
                    onClick={runAnalysis}
                    disabled={analysisLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                  >
                    {analysisLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ScanLine className="w-4 h-4" />
                    )}
                    {analysisLoading ? "جارٍ التحليل..." : "تحليل الموقع"}
                  </Button>
                </div>

                {analysisLoading && (
                  <div className="border border-border rounded-lg p-4 bg-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-sm font-medium text-foreground">جارٍ فحص الموقع...</span>
                    </div>
                    <p className="text-xs text-muted-foreground">يتم مسح 7+ صفحة والتحقق من meta tags, structured data, المحتوى, والسيرفر</p>
                    <div className="mt-3 h-1 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </div>
                )}

                {analysisError && (
                  <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Bug className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">فشل التحليل</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{analysisError}</p>
                  </div>
                )}

                {analysisResult && (() => {
                  const r = analysisResult as any;
                  const sum = r.summary as any;

                  return (
                    <div className="space-y-4">
                      {/* Score cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                          <p className="text-xs text-muted-foreground">الصفحات الممسوحة</p>
                          <p className="text-xl font-black text-foreground mt-1">{sum.pagesScanned}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                          <p className="text-xs text-muted-foreground">المشاكل المكتشفة</p>
                          <p className="text-xl font-black text-red-500 mt-1">{sum.totalIssues}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                          <p className="text-xs text-muted-foreground">مشاكل حرجة</p>
                          <p className="text-xl font-black text-rose-500 mt-1">{sum.criticalIssues}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                          <p className="text-xs text-muted-foreground">احتمال موافقة AdSense</p>
                          <p className="text-xl font-black text-emerald-500 mt-1">{sum.approvalProbability}%</p>
                        </div>
                      </div>

                      {/* Issues found */}
                      {sum.totalIssues > 0 && (
                        <div className="border border-border rounded-xl p-4 bg-card">
                          <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            المشاكل المكتشفة
                          </h3>
                          <div className="space-y-1 max-h-64 overflow-y-auto">
                            {(r.pages as any[] || []).flatMap((p: any) => (p.issues || []).filter((i: any) => i.type === "critical")).slice(0, 10).map((issue: any, i: number) => (
                              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-foreground font-medium">{issue.message}</p>
                                  <p className="text-[10px] text-muted-foreground">{issue.detail}</p>
                                </div>
                              </div>
                            ))}
                            {(r.content?.issues as any[] || []).filter((i: any) => i.type === "critical").slice(0, 3).map((issue: any, i: number) => (
                              <div key={`c-${i}`} className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-foreground font-medium">{issue.message}</p>
                                  <p className="text-[10px] text-muted-foreground">{issue.suggestion}</p>
                                </div>
                              </div>
                            ))}
                            {(r.seo?.issues as any[] || []).filter((i: any) => i.type === "critical").slice(0, 3).map((issue: any, i: number) => (
                              <div key={`s-${i}`} className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-foreground font-medium">{issue.message}</p>
                                  <p className="text-[10px] text-muted-foreground">{issue.suggestion}</p>
                                </div>
                              </div>
                            ))}
                            {(r.trust?.issues as any[] || []).filter((i: any) => i.type === "critical").slice(0, 3).map((issue: any, i: number) => (
                              <div key={`t-${i}`} className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-foreground font-medium">{issue.message}</p>
                                  <p className="text-[10px] text-muted-foreground">{issue.suggestion}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-secondary/30 rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-1.5 mb-1">
                            <FileText className="w-3 h-3 text-blue-400" />
                            <p className="text-xs text-muted-foreground">المحتوى</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {r.content?.hasPersonalVoice ? "بصمة بشرية ✓" : "قد يكون مولّداً بالذكاء"}
                          </p>
                          {r.content?.aiProbability > 50 && (
                            <p className="text-[10px] text-red-400 mt-0.5">AI probability: {r.content.aiProbability}%</p>
                          )}
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-1.5 mb-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <p className="text-xs text-muted-foreground">SEO</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {r.seo?.sitemapScore > 50 ? "Sitemap صحيح ✓" : "Sitemap به مشاكل"}
                          </p>
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-violet-400" />
                            <p className="text-xs text-muted-foreground">الثقة</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {r.trust?.hasPrivacyPolicy ? "سياسة خصوصية ✓" : "سياسة خصوصية مفقودة"}
                          </p>
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Radio className="w-3 h-3 text-amber-400" />
                            <p className="text-xs text-muted-foreground">الأداء</p>
                          </div>
                          <p className="text-sm font-bold text-foreground">
                            {r.performance?.hasNextImage ? "صور محسّنة ✓" : "استخدم next/image"}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button
                          onClick={runAnalysis}
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs"
                          disabled={analysisLoading}
                        >
                          <RefreshCw className="w-3 h-3" />
                          تحديث التحليل
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
