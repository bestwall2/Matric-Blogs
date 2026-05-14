'use client';

import { useState, useCallback, useMemo } from "react";
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
  Loader2, Radio, RefreshCw, Bug, AlertTriangle, CheckCircle2, FileText,
  Copy, ChevronLeft, ChevronRight, Check, ArrowLeft, ArrowRight,
  ExternalLink, Code2, FileCode, Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---- FIX DEFINITIONS ----
interface FixStep {
  id: string;
  label: string;
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  detail: string;
  autoFixable: boolean;
  filePath?: string;
  code?: string;
  instructions: string[];
  category: string;
}

function getFixesForResult(result: any): FixStep[] {
  const r = result as any;
  const fixes: FixStep[] = [];

  // 1. Sitemap double slashes
  const sitemapIssues = r.sitemap?.issues || [];
  if (sitemapIssues.some((i: any) => i.message?.includes("Double slash"))) {
    fixes.push({
      id: "sitemap-slash",
      label: "إصلاح الروابط المكررة في Sitemap",
      priority: "critical",
      description: "Sitemap يحتوي على شرطتين مائلتين (//) في الروابط",
      detail: "المشكلة: متغير SITE_URL يحتوي على / في النهاية. الحل: إزالة الشرطة المائلة من المتغير أو تعديل الكود.",
      autoFixable: false,
      filePath: "artifacts/matric-blog/src/app/sitemap.ts",
      code: `const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://matric-blogs-26.vercel.app").replace(/\\/+$/, "");`,
      instructions: [
        "افتح ملف sitemap.ts",
        "عدّل السطر الذي يعرّف SITE_URL بإضافة .replace(/\\/+$/, '')",
        "أو اذهب إلى Vercel Dashboard → Environment Variables وتأكد أن NEXT_PUBLIC_SITE_URL لا يحتوي على / في النهاية",
        "أعد النشر بعد التعديل"
      ],
      category: "seo"
    });
  }

  // 2. Missing Organization/Website schema
  const hasOrgSchema = r.pages?.some((p: any) => p.schemaTypes?.includes("Organization") || p.schemaTypes?.includes("WebSite"));
  if (!hasOrgSchema) {
    fixes.push({
      id: "org-schema",
      label: "إضافة Organization + WebSite Schema",
      priority: "high",
      description: "الصفحة الرئيسية لا تحتوي على schema منظمة أو موقع",
      detail: "مطلوب لـ Google Knowledge Panel ولتحسين E-E-A-T",
      autoFixable: false,
      filePath: "artifacts/matric-blog/src/app/layout.tsx",
      code: `// أضف هذا الكود في الميتاداتا في layout.tsx
export const metadata: Metadata = {
  // ... الميتاداتا الموجودة
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ماتريكبلوغ",
      "url": "https://matric-blogs-26.vercel.app",
      "logo": "https://matric-blogs-26.vercel.app/logo.png",
      "sameAs": [
        "https://twitter.com/MatricBlog"
      ]
    })
  }
};`,
      instructions: [
        "افتح ملف src/app/layout.tsx",
        "أضف الكود أعلاه إلى كائن metadata",
        "أو أضف <script> tag في RootLayout مباشرة"
      ],
      category: "schema"
    });
  }

  // 3. Missing breadcrumb schema
  const hasBreadcrumb = r.pages?.some((p: any) => p.schemaTypes?.includes("BreadcrumbList"));
  if (!hasBreadcrumb) {
    fixes.push({
      id: "breadcrumb-schema",
      label: "إضافة BreadcrumbList Schema",
      priority: "medium",
      description: "لا يوجد Breadcrumb structured data في أي صفحة",
      detail: "يساعد Google في فهم هيكل الموقع ويحسن ظهور搜索结果",
      autoFixable: false,
      filePath: "artifacts/matric-blog/src/app/blog/[slug]/page.tsx",
      code: `// أضف هذا مع JSON-LD الموجود في صفحة المقال
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "المدونة", "item": \`\${SITE_URL}/blog\` },
    { "@type": "ListItem", "position": 3, "name": title, "item": url }
  ]
};`,
      instructions: [
        "افتح ملف src/app/blog/[slug]/page.tsx",
        "أضف breadcrumbLd قبل jsonLd الحالي",
        "أضف <script> tag ثانٍ في JSX"
      ],
      category: "schema"
    });
  }

  // 4. Missing meta descriptions for static pages
  const aboutPage = r.pages?.find((p: any) => p.url?.includes("/about"));
  if (aboutPage && (!aboutPage.metaDescription || aboutPage.metaDescription?.length < 30)) {
    fixes.push({
      id: "meta-about",
      label: "إضافة Meta Description لصفحة من نحن",
      priority: "high",
      description: "صفحة About تفتقر إلى وصف meta مناسب",
      detail: "الوصف الحالي غير كافٍ أو مفقود",
      autoFixable: false,
      filePath: "artifacts/matric-blog/src/app/about/page.tsx",
      code: `export const metadata: Metadata = {
  title: "من نحن — ماتريكبلوغ",
  description: "ماتريكبلوغ — موقعك الرائد في أخبار كرة القدم والبث المباشر والمحتوى التقني باللغة العربية. نقدم محتوى عربي أصيل لجمهور المغرب والوطن العربي.",
  openGraph: {
    title: "من نحن — ماتريكبلوغ",
    description: "ماتريكبلوغ — موقعك الرائد في أخبار كرة القدم والبث المباشر والمحتوى التقني.",
    type: "website",
  },
};`,
      instructions: ["افتح ملف about/page.tsx", "أضف export const metadata مع title و description و openGraph"],
      category: "meta"
    });
  }

  const contactPage = r.pages?.find((p: any) => p.url?.includes("/contact"));
  if (contactPage && (!contactPage.metaDescription || contactPage.metaDescription?.length < 30)) {
    fixes.push({
      id: "meta-contact",
      label: "إضافة Meta Description لصفحة تواصل معنا",
      priority: "high",
      description: "صفحة Contact تفتقر إلى وصف meta مناسب",
      detail: "الوصف الحالي غير كافٍ أو مفقود",
      autoFixable: false,
      filePath: "artifacts/matric-blog/src/app/contact/page.tsx",
      code: `export const metadata: Metadata = {
  title: "تواصل معنا — ماتريكبلوغ",
  description: "تواصل مع فريق ماتريكبلوغ عبر البريد الإلكتروني أو تويتر. يسعدنا الاستماع إلى آرائك واقتراحاتك.",
  openGraph: {
    title: "تواصل معنا — ماتريكبلوغ",
    description: "تواصل مع فريق ماتريكبلوغ.",
    type: "website",
  },
};`,
      instructions: ["افتح ملف contact/page.tsx", "أضف export const metadata مع title و description و openGraph"],
      category: "meta"
    });
  }

  // 5. AI content detection
  if (r.content?.aiProbability > 50) {
    fixes.push({
      id: "ai-content",
      label: "تحسين المحتوى لخفض نسبة اكتشاف AI",
      priority: "critical",
      description: `نسبة اكتشاف AI: ${r.content.aiProbability}%. المحتوى يبدو مولّداً بالذكاء الاصطناعي`,
      detail: "الإشارات: " + (r.content?.aiSignals?.slice(0, 3).join("، ") || "لا توجد إشارات مفصلة"),
      autoFixable: false,
      filePath: "كتيب التحسين",
      code: `// لكل مقالة:
// 1. أضف تجربة شخصية: "في تجربتي..." "استخدمت هذا الأداة لمدة أسبوع..."
// 2. أضف أرقاماً حقيقية: "حصلت على 1500 مشاهدة في اليوم الأول"
// 3. استخدم لغة محادثة طبيعية بدلاً من اللغة الرسمية
// 4. تجنب العبارات: "في عصر السرعة الرقمية" "لا شك أن" "يتجه العالم"
// 5. أضف صوراً حقيقية (screenshots) من التجربة
// 6. احذف أقسام الأسئلة الشائعة (FAQ) أو اجعلها طبيعية`,
      instructions: [
        "أعد كتابة المقالات الثلاثة الموجودة بأسلوب شخصي",
        "أضف تجارب حقيقية: ماذا استخدمت؟ كيف كانت النتيجة؟",
        "أضف لقطات شاشة حقيقية",
        "احذف العبارات الافتتاحية المكررة",
        "اجعل كل مقالة فريدة بمعلومات لا توجد في أي مكان آخر",
        "استهدف 1500+ كلمة لكل مقالة"
      ],
      category: "content"
    });
  }

  // 6. Custom domain
  fixes.push({
    id: "custom-domain",
    label: "تسجيل نطاق مخصص (Custom Domain)",
    priority: "critical",
    description: "الموقع يستخدم نطاق vercel.app المجاني",
    detail: "Google AdSense يرفض المواقع ذات النطاقات المجانية. هذا أحد أهم أسباب الرفض.",
    autoFixable: false,
    filePath: "Vercel Dashboard → Domains",
    code: `// الخطوات:
// 1. اشترِ نطاقاً من عندك (مثلاً matricblog.com من Namecheap, GoDaddy, Hostinger)
// 2. اذهب إلى Vercel Dashboard → Project → Settings → Domains
// 3. أضف النطاق الجديد
// 4. حدّث DNS (أضف CNAME إلى Vercel)
// 5. انتظر 5-10 دقائق للتفعيل
// 6. حدّث NEXT_PUBLIC_SITE_URL في Environment Variables`,
    instructions: [
      "اشترِ نطاقاً مثل matricblog.com أو matric-blog.com",
      "أضف النطاق في Vercel Dashboard",
      "حدّث DNS settings",
      "حدّث متغير NEXT_PUBLIC_SITE_URL"
    ],
    category: "infrastructure"
  });

  // 7. Broken blog page
  const blogPage = r.pages?.find((p: any) => p.url?.includes("/blog") && !p.url?.includes("/blog/"));
  if (blogPage && blogPage.wordCount < 50) {
    fixes.push({
      id: "blog-ssr",
      label: "إصلاح صفحة المدونة (Blog Listing)",
      priority: "critical",
      description: "صفحة /blog لا تظهر المحتوى — تعرض 'جاري التحميل...'",
      detail: "فشل الطلب من السيرفر (SSR) عند تحميل الصفحة",
      autoFixable: true,
      filePath: "artifacts/matric-blog/src/app/blog/page.tsx",
      code: `// المشكلة: SITE_URL يستخدم رابط خارجي وقد يفشل أثناء SSR
// الحل: استخدم الرابط النسبي أو استعمل VERCEL_URL
const SITE_URL = process.env.VERCEL_URL 
  ? \`https://\${process.env.VERCEL_URL}\`
  : process.env.NEXT_PUBLIC_SITE_URL || "https://matric-blogs-26.vercel.app";`,
      instructions: [
        "افتح ملف src/app/blog/page.tsx",
        "عدّل تعريف SITE_URL كما هو موضح",
        "أعد النشر"
      ],
      category: "bug"
    });
  }

  // 8. next/image
  if (!r.performance?.hasNextImage && (r.performance?.imageCount || 0) > 0) {
    fixes.push({
      id: "next-image",
      label: "استخدام next/image بدلاً من <img>",
      priority: "high",
      description: `${r.performance?.imageCount || 0} صورة تستخدم <img> بدلاً من next/image`,
      detail: "next/image يوفر تحويل WebP تلقائي، تحجيم، Lazy loading",
      autoFixable: false,
      filePath: "مثال للمقالات",
      code: `// قبل (خطأ):
<img src={post.featured_image} alt={title} className="..." />

// بعد (صحيح):
import Image from "next/image";
<Image 
  src={post.featured_image} 
  alt={title}
  width={1200}
  height={630}
  className="..."
/>`,
      instructions: [
        "افتح كل ملف يستخدم <img>",
        "استبدله بـ <Image from next/image>",
        "أضف width و height لمنع layout shift",
        "أعد النشر"
      ],
      category: "performance"
    });
  }

  // 9. English title on Arabic article
  const articlesWithEnTitle = r.pages?.filter((p: any) => p.url?.includes("/blog/") && p.title && !/[\u0600-\u06FF]/.test(p.title));
  if (articlesWithEnTitle?.length > 0) {
    fixes.push({
      id: "arabic-title",
      label: "إصلاح عنوان article بالعربية",
      priority: "critical",
      description: `المقالات ${articlesWithEnTitle.map((p: any) => p.url?.split("/").pop()).join(", ")} لها عنوان إنجليزي في <title>`,
      detail: "المحتوى عربي لكن عنوان SEO إنجليزي. يجب أن يكون العنوان بالعربية.",
      autoFixable: false,
      filePath: "artifacts/matric-blog/src/app/blog/[slug]/page.tsx",
      code: `// الأولوية: Arabic title → meta_title → English title
const title = post.title_ar || post.meta_title || post.title;
// بهذا الترتيب، Arabic title هو الأهم دائماً في <title>
return { title, ... };`,
      instructions: [
        "افتح ملف blog/[slug]/page.tsx",
        "في generateMetadata، غير السطر title: post.meta_title || title",
        "استبدله بـ: title: post.title_ar || post.meta_title || post.title",
        "بهذا الترتيب: Arabic title هو الأساسي، ثم meta_title، ثم English title كخيار أخير"
      ],
      category: "meta"
    });
  }

  return fixes;
}

// ---- COMPONENT ----
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

  const [activeTab, setActiveTab] = useState<"seo" | "adsense">("seo");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Fix wizard state
  const [wizardMode, setWizardMode] = useState<"scan" | "wizard" | "done">("scan");
  const [currentStep, setCurrentStep] = useState(0);
  const [fixedSteps, setFixedSteps] = useState<Set<string>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<string>>(new Set());

  // Get fixes list
  const fixes = useMemo(() => {
    if (!analysisResult) return [];
    return getFixesForResult(analysisResult);
  }, [analysisResult]);

  const currentFix = fixes[currentStep];
  const totalIssues = fixes.length;
  const fixedCount = fixedSteps.size;
  const skippedCount = skippedSteps.size;
  const remaining = totalIssues - fixedCount - skippedCount;

  const runAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setWizardMode("scan");
    setCurrentStep(0);
    setFixedSteps(new Set());
    setSkippedSteps(new Set());
    try {
      const siteUrl = window.location.origin;
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: siteUrl }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || `HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Analysis failed");
      setAnalysisResult(json.data);
      toast.success(`تم العثور على ${json.data.summary?.totalIssues || 0} مشكلة`);
    } catch (err: any) {
      setAnalysisError(err.message || "فشل التحليل");
      toast.error("فشل التحليل");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const markFixed = useCallback((id: string) => {
    setFixedSteps(prev => new Set(prev).add(id));
    if (currentStep < fixes.length - 1) {
      setCurrentStep(s => s + 1);
    } else if (currentStep >= fixes.length - 1) {
      setWizardMode("done");
    }
  }, [currentStep, fixes.length]);

  const skipStep = useCallback((id: string) => {
    setSkippedSteps(prev => new Set(prev).add(id));
    if (currentStep < fixes.length - 1) {
      setCurrentStep(s => s + 1);
    } else if (currentStep >= fixes.length - 1) {
      setWizardMode("done");
    }
  }, [currentStep, fixes.length]);

  const goToStep = useCallback((idx: number) => {
    if (idx >= 0 && idx < fixes.length) setCurrentStep(idx);
  }, [fixes.length]);

  const startWizard = useCallback(() => {
    setWizardMode("wizard");
    setCurrentStep(0);
  }, []);

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(
      () => toast.success("تم نسخ الكود!"),
      () => toast.error("فشل النسخ")
    );
  }, []);

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

  const getPriorityBadge = (p: string) => {
    const m: Record<string, { label: string; cls: string }> = {
      critical: { label: "حرج", cls: "bg-red-500/15 text-red-500 border-red-500/20" },
      high: { label: "عالي", cls: "bg-orange-500/15 text-orange-500 border-orange-500/20" },
      medium: { label: "متوسط", cls: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20" },
      low: { label: "منخفض", cls: "bg-green-500/15 text-green-500 border-green-500/20" },
    };
    const b = m[p] || m.medium;
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${b.cls}`}>{b.label}</span>;
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-6 max-w-5xl">

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-card border border-border rounded-xl p-1 w-fit">
            <button onClick={() => setActiveTab("seo")}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "seo" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <Wand2 className="w-4 h-4" /> أدوات SEO
            </button>
            <button onClick={() => setActiveTab("adsense")}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "adsense" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <ShieldCheck className="w-4 h-4" /> تحليل AdSense
            </button>
          </div>

          {/* === SEO TAB === */}
          {activeTab === "seo" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                  <h2 className="font-bold text-foreground text-sm">تحليل SEO</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">عنوان المقال</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border text-right text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">الكلمة المفتاحية</Label>
                      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-secondary border-border text-right text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Meta Title</Label>
                      <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="bg-secondary border-border text-sm" />
                      <p className="text-xs text-muted-foreground">{metaTitle.length}/60</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Meta Description</Label>
                      <Input value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="bg-secondary border-border text-sm" />
                      <p className="text-xs text-muted-foreground">{metaDesc.length}/160</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">محتوى HTML</Label>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="bg-secondary border-border font-mono text-xs min-h-32" dir="ltr" placeholder="<h2>...</h2><p>...</p>" />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <h2 className="font-bold text-foreground text-sm">تحسين بالذكاء الاصطناعي</h2>
                  <div className="space-y-1.5">
                    <Label className="text-xs">تعليمات إضافية</Label>
                    <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} className="bg-secondary border-border text-right text-sm" placeholder="مثال: ركز على جمهور مغربي" />
                  </div>
                  <Button onClick={handleImprove} disabled={improveContent.isPending || !content} className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
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

          {/* === ADSENSE TAB === */}
          {activeTab === "adsense" && (
            <div className="space-y-4">

              {/* Scan Button + Status */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-foreground text-sm">معالج إصلاح AdSense</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">مسح الموقع → إصلاح المشاكل خطوة بخطوة → إعادة المسح</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={runAnalysis} disabled={analysisLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                      {analysisLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                      {analysisLoading ? "جارٍ المسح..." : "مسح الموقع"}
                    </Button>
                    {analysisResult && fixes.length > 0 && wizardMode !== "wizard" && (
                      <Button onClick={startWizard} variant="outline" className="gap-2">
                        <Wrench className="w-4 h-4" />
                        ابدأ الإصلاح ({totalIssues})
                      </Button>
                    )}
                  </div>
                </div>

                {analysisLoading && (
                  <div className="border border-border rounded-lg p-4 bg-secondary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-sm font-medium text-foreground">جارٍ فحص الموقع...</span>
                    </div>
                    <p className="text-xs text-muted-foreground">يتم مسح 7+ صفحات والتحقق من meta tags, structured data, المحتوى, والسيرفر</p>
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
                    <Button onClick={runAnalysis} size="sm" variant="outline" className="mt-2 text-xs">إعادة المحاولة</Button>
                  </div>
                )}

                {/* Summary (non-wizard mode) */}
                {analysisResult && wizardMode === "scan" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground">الصفحات</p>
                      <p className="text-xl font-black text-foreground mt-1">{analysisResult.summary?.pagesScanned || 0}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground">المشاكل الكلية</p>
                      <p className="text-xl font-black text-red-500 mt-1">{totalIssues}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground">تم الإصلاح</p>
                      <p className="text-xl font-black text-emerald-500 mt-1">{fixedCount}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground">احتمال الموافقة</p>
                      <p className="text-xl font-black text-foreground mt-1">{analysisResult.summary?.approvalProbability || 0}%</p>
                    </div>
                  </div>
                )}
              </div>

              {/* === FIX WIZARD === */}
              {analysisResult && wizardMode === "wizard" && fixes.length > 0 && currentFix && (
                <div className="rounded-xl border border-border bg-card p-3 md:p-5">
                  {/* Wizard Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-foreground">معالج الإصلاح</h3>
                        <p className="text-xs text-muted-foreground">الخطوة {currentStep + 1} من {totalIssues}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-xl px-3 py-1.5 w-fit">
                      <span className="text-emerald-500 whitespace-nowrap">{fixedCount} تم</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-amber-500 whitespace-nowrap">{skippedCount} تخطي</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-red-500 whitespace-nowrap">{remaining} متبقي</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 rounded-full bg-border overflow-hidden mb-4">
                    <div className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-primary transition-all duration-500"
                      style={{ width: `${((fixedCount + skippedCount) / totalIssues) * 100}%` }} />
                  </div>

                  {/* Issue Steps Navigation - scrollable on mobile */}
                  <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 scrollbar-thin" style={{ WebkitOverflowScrolling: "touch" }}>
                    <div className="flex items-center gap-1 mx-auto sm:mx-0">
                    {fixes.map((fix, idx) => {
                      const isDone = fixedSteps.has(fix.id);
                      const isSkipped = skippedSteps.has(fix.id);
                      const isActive = idx === currentStep;
                      return (
                        <button key={fix.id} onClick={() => goToStep(idx)}
                          className={cn(
                            "w-7 h-7 rounded-lg text-[10px] font-bold transition-all shrink-0",
                            isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                            isDone ? "bg-emerald-500/20 text-emerald-500" :
                            isSkipped ? "bg-amber-500/20 text-amber-500" :
                            idx < currentStep ? "bg-muted text-muted-foreground" :
                            "bg-secondary text-muted-foreground"
                          )}>
                          {isDone ? <Check className="w-3 h-3 mx-auto" /> : isSkipped ? <span>—</span> : idx + 1}
                        </button>
                      );
                    })}
                    </div>
                  </div>

                  {/* Current Fix Details */}
                  <div className="border border-border rounded-xl p-3 md:p-4 space-y-3 md:space-y-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-foreground break-words">{currentFix.label}</h4>
                          {getPriorityBadge(currentFix.priority)}
                          {currentFix.autoFixable && (
                            <span className="text-[10px] bg-blue-500/15 text-blue-500 px-1.5 py-0.5 rounded-full font-semibold">Auto-fix متاح</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{currentFix.description}</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">{currentFix.detail}</p>
                      </div>
                    </div>

                    {/* File Path - responsive */}
                    {currentFix.filePath && (
                      <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 overflow-x-auto">
                        <FileCode className="w-3 h-3 shrink-0" />
                        <span className="whitespace-nowrap md:whitespace-normal font-mono">{currentFix.filePath}</span>
                      </div>
                    )}

                    {/* Code Block - mobile optimized */}
                    {currentFix.code && (
                      <div className="relative overflow-hidden rounded-lg border border-border">
                        <div className="flex items-center justify-between bg-muted px-2 md:px-3 py-1.5 border-b border-border">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Code2 className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span className="text-[9px] md:text-[10px] text-muted-foreground font-mono truncate">الكود المطلوب</span>
                          </div>
                          <button onClick={() => copyCode(currentFix.code!)}
                            className="flex items-center gap-1 text-[9px] md:text-[10px] text-primary hover:text-primary/80 transition-colors shrink-0">
                            <Copy className="w-2.5 h-2.5 md:w-3 md:h-3" /> نسخ
                          </button>
                        </div>
                        <pre className="bg-muted/50 p-2 md:p-3 text-[10px] md:text-xs font-mono text-foreground whitespace-pre-wrap overflow-x-auto max-h-40 md:max-h-60 overflow-y-auto leading-relaxed" dir="ltr">{currentFix.code}</pre>
                      </div>
                    )}

                    {/* Instructions */}
                    {currentFix.instructions.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-foreground mb-2">خطوات التطبيق:</p>
                        <ol className="space-y-1.5">
                          {currentFix.instructions.map((inst, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] md:text-xs text-muted-foreground">
                              <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[8px] md:text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                              <span className="break-words">{inst}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Actions - stack on mobile */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-border">
                      <div className="flex gap-2">
                        <Button onClick={() => markFixed(currentFix.id)} size="sm" className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 text-xs">
                          <Check className="w-3.5 h-3.5" /> تم الإصلاح
                        </Button>
                        <Button onClick={() => skipStep(currentFix.id)} size="sm" variant="outline" className="flex-1 sm:flex-none gap-1 text-xs">
                          تخطي
                        </Button>
                      </div>
                      <div className="flex-1" />
                      <div className="flex gap-1 justify-center">
                        <Button onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0} size="sm" variant="ghost" className="gap-1 text-[11px] md:text-xs px-2">
                          <ChevronRight className="w-3 h-3" /> السابق
                        </Button>
                        <Button onClick={() => goToStep(currentStep + 1)} disabled={currentStep >= fixes.length - 1} size="sm" variant="ghost" className="gap-1 text-[11px] md:text-xs px-2">
                          التالي <ChevronLeft className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === ALL DONE === */}
              {analysisResult && wizardMode === "done" && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-1">تمت معالجة جميع المشاكل!</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {fixedCount} مشكلة تم إصلاحها{fixedCount > 0 && ", "}{skippedCount > 0 && `${skippedCount} تم تخطيها`}
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    أعد مسح الموقع للتأكد من حل جميع المشاكل
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={runAnalysis} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                      <RefreshCw className="w-4 h-4" />
                      إعادة المسح
                    </Button>
                    <Button onClick={() => setWizardMode("scan")} variant="outline">
                      عرض النتائج
                    </Button>
                    <Button onClick={startWizard} variant="ghost" className="gap-1">
                      <ArrowRight className="w-3 h-3" />
                      مراجعة المشاكل المتبقية
                    </Button>
                  </div>
                </div>
              )}

              {/* No issues found */}
              {analysisResult && fixes.length === 0 && wizardMode === "scan" && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-black text-foreground mb-1">لا توجد مشاكل!</h3>
                  <p className="text-sm text-muted-foreground mb-4">الموقع يبدو جاهزاً لطلب AdSense</p>
                  <Button onClick={runAnalysis} variant="outline" size="sm" className="gap-1 text-xs">
                    <RefreshCw className="w-3 h-3" /> إعادة المسح
                  </Button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
