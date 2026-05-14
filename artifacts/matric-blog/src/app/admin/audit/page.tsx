'use client';

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { AuditAnalysisResult } from "@/lib/audit/types";
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle, AlertCircle, AlertTriangle,
  Download, Lightbulb, ClipboardList, TrendingUp, FileSearch, UserCheck,
  Palette, Globe, Zap, Shield, DollarSign, BookOpen, Brain, Target,
  ChevronRight, Save, Plus, X, Edit3, MessageSquare, ThumbsUp, ExternalLink,
  ArrowUpDown, Play, Loader2, Radio, RefreshCw, ScanLine, Bug
} from "lucide-react";

type ItemStatus = "pending" | "in_progress" | "done";
type Priority = "critical" | "high" | "medium" | "low";

interface AuditItem {
  id: string;
  label: string;
  description: string;
  priority: Priority;
  status: ItemStatus;
  notes: string;
  suggestion: string;
  category: string;
}

interface AuditSection {
  id: string;
  title: string;
  icon: any;
  items: AuditItem[];
  score: number;
  notes: string;
  expanded: boolean;
}

const DEFAULT_SECTIONS: AuditSection[] = [
  {
    id: "adsense",
    title: "1. Google AdSense Compliance",
    icon: Shield,
    score: 12,
    notes: "",
    expanded: false,
    items: [
      { id: "adsense-1", label: "Thin Content (< 25 articles)", description: "Site only has 3 articles. Need 25-30 minimum.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "adsense-2", label: "Low-value generic content", description: "Articles are generic summaries with no original research.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "adsense-3", label: "AI-generated content detection risk", description: "Clear AI writing patterns detected (95%+ probability).", priority: "critical", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "adsense-4", label: "No E-E-A-T signals", description: "No author credentials, bios, or expertise demonstration.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "adsense-5", label: "Fake/placeholder contact info", description: "WhatsApp +212 600 000000 is all zeros. Twitter likely nonexistent.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "adsense-6", label: "Misleading claims on About page", description: "Claims 'نخدم ملايين القراء' (serve millions) — dishonest for 3-article site.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "adsense-7", label: "Site maturity", description: "Site appears brand new (all articles from May 2026). Needs 3-6 months of history.", priority: "high", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "adsense-8", label: "No original research or data", description: "All articles lack statistics, original data, or unique insights.", priority: "high", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "adsense-9", label: "Duplicate content risk", description: "Content reads like it was summarized from other sources without original value.", priority: "high", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "adsense-10", label: "Clickbait title patterns", description: "Some titles use hyperbolic language ('خرافي!', 'دليلك الشامل').", priority: "medium", status: "pending", notes: "", suggestion: "", category: "content" },
    ]
  },
  {
    id: "content",
    title: "2. Content Quality Audit",
    icon: BookOpen,
    score: 10,
    notes: "",
    expanded: false,
    items: [
      { id: "content-1", label: "AI writing patterns in all 3 articles", description: "Formulaic structure, no first-person, generic observations, FAQ hallmarks.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "quality" },
      { id: "content-2", label: "Article 1: World Cup 2026", description: "Shallow summary, no original data, no quotes, no specific match info.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "article" },
      { id: "content-3", label: "Article 2: Make Money Online", description: "Nonsensical Arabic phrase 'المال أعرف من إنترنت الذكاء الاصطناعي'. 5 generic methods, no real earnings.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "article" },
      { id: "content-4", label: "Article 3: AI Video Creation", description: "Overused opener 'في عصر السرعة الرقمية'. 3 tools listed with zero comparison.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "article" },
      { id: "content-5", label: "Weak introductions", description: "All articles start with generic 'in the digital age' filler.", priority: "high", status: "pending", notes: "", suggestion: "", category: "quality" },
      { id: "content-6", label: "Weak conclusions", description: "End abruptly with no call-to-action or summary of key takeaways.", priority: "high", status: "pending", notes: "", suggestion: "", category: "quality" },
      { id: "content-7", label: "No search intent depth", description: "Surface-level coverage doesn't fully satisfy reader intent.", priority: "high", status: "pending", notes: "", suggestion: "", category: "quality" },
      { id: "content-8", label: "No multimedia in articles", description: "Zero embedded videos, infographics, or interactive elements.", priority: "high", status: "pending", notes: "", suggestion: "", category: "quality" },
      { id: "content-9", label: "No internal linking", description: "Only 3 articles — no meaningful cross-linking possible yet.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "quality" },
      { id: "content-10", label: "Generic FAQ sections", description: "Every article has an FAQ — AI hallmark. Questions are obvious and generic.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "quality" },
    ]
  },
  {
    id: "design",
    title: "3. Design & UX Review",
    icon: Palette,
    score: 55,
    notes: "",
    expanded: false,
    items: [
      { id: "design-1", label: "No custom domain (vercel.app subdomain)", description: "Free hosting domain hurts trust significantly.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "design-2", label: "Broken blog listing page", description: "/blog shows 'Loading...' — server-rendering fetch fails.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "bug" },
      { id: "design-3", label: "No logo image", description: "Only text-based logo. Needs SVG/PNG with proper alt text.", priority: "high", status: "pending", notes: "", suggestion: "", category: "brand" },
      { id: "design-4", label: "Gimmicky hero title highlight", description: "First word in primary color split is amateur-looking.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "ui" },
      { id: "design-5", label: "No CTA on hero section", description: "Hero has no explicit call-to-action button.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "ux" },
      { id: "design-6", label: "Small article body font size", description: "Body text may be too small for comfortable long-form reading.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "ux" },
      { id: "design-7", label: "Empty states not handled", description: "Loading spinners show with no fallback content.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "ux" },
      { id: "design-8", label: "No social media in header/footer", description: "No icons linking to social profiles.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "design-9", label: "Footer 'قانوني' heading vague", description: "Should be 'صفحات قانونية' for clarity.", priority: "low", status: "pending", notes: "", suggestion: "", category: "ui" },
    ]
  },
  {
    id: "seo",
    title: "4. Technical SEO Audit",
    icon: Globe,
    score: 45,
    notes: "",
    expanded: false,
    items: [
      { id: "seo-1", label: "Sitemap double slashes in URLs", description: "https://matric-blogs-26.vercel.app//blog — SITE_URL has trailing slash.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "bug" },
      { id: "seo-2", label: "English title tag on Arabic article", description: "World Cup article <title> is in English, page content is Arabic.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "meta" },
      { id: "seo-3", label: "No breadcrumb structured data", description: "Missing BreadcrumbList schema on all pages.", priority: "high", status: "pending", notes: "", suggestion: "", category: "schema" },
      { id: "seo-4", label: "No Organization/Website schema", description: "Homepage missing these schemas for brand authority.", priority: "high", status: "pending", notes: "", suggestion: "", category: "schema" },
      { id: "seo-5", label: "Missing hreflang tags", description: "Arabic content should have hreflang='ar' tags.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "meta" },
      { id: "seo-6", label: "Weak internal linking", description: "Only 3 articles — need content network for proper internal linking.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "links" },
      { id: "seo-7", label: "Image alt text not verified", description: "Need to ensure all images have descriptive Arabic alt text.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "images" },
    ]
  },
  {
    id: "performance",
    title: "5. Performance & Speed",
    icon: Zap,
    score: 40,
    notes: "",
    expanded: false,
    items: [
      { id: "perf-1", label: "Using <img> instead of next/image", description: "Loses automatic optimization, WebP conversion, lazy loading.", priority: "high", status: "pending", notes: "", suggestion: "", category: "optimization" },
      { id: "perf-2", label: "No explicit image dimensions", description: "Missing width/height on images causes CLS.", priority: "high", status: "pending", notes: "", suggestion: "", category: "optimization" },
      { id: "perf-3", label: "Large JS bundle", description: "React, React Query, all Lucide icons shipped on every page.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "optimization" },
      { id: "perf-4", label: "Google Font loading blocking", description: "Cairo font from Google Fonts may block render.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "optimization" },
      { id: "perf-5", label: "No service worker / caching strategy", description: "No PWA or caching for repeat visits.", priority: "low", status: "pending", notes: "", suggestion: "", category: "optimization" },
    ]
  },
  {
    id: "trust",
    title: "6. Trust & Brand Authority",
    icon: UserCheck,
    score: 8,
    notes: "",
    expanded: false,
    items: [
      { id: "trust-1", label: "No real author identity", description: "No author photos, bios, credentials, or social links on articles.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "credibility" },
      { id: "trust-2", label: "Fake/broken contact methods", description: "WhatsApp all zeros, Twitter likely fake, email domain doesn't resolve.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "contact" },
      { id: "trust-3", label: "No social proof", description: "Zero comments, zero share counts, zero testimonials.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "social" },
      { id: "trust-4", label: "No business legitimacy", description: "No company registration, no address, no real-world identity.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "legal" },
      { id: "trust-5", label: "Dishonest About page claims", description: "'نخدم ملايين القراء' — transparently false for this site.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "trust-6", label: "No real social media presence", description: "No active Twitter, YouTube, or other social accounts.", priority: "high", status: "pending", notes: "", suggestion: "", category: "social" },
      { id: "trust-7", label: "No author profile pages", description: "Clicking author name should go to author archive.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "credibility" },
    ]
  },
  {
    id: "monetization",
    title: "7. Monetization Readiness",
    icon: DollarSign,
    score: 5,
    notes: "",
    expanded: false,
    items: [
      { id: "mon-1", label: "AdSense: Not enough content", description: "Need 25-30 articles minimum before application.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "readiness" },
      { id: "mon-2", label: "AdSense: No traffic", description: "Zero organic traffic or established audience.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "readiness" },
      { id: "mon-3", label: "Affiliate marketing: Not ready", description: "No audience trust or traffic for affiliate conversions.", priority: "high", status: "pending", notes: "", suggestion: "", category: "readiness" },
      { id: "mon-4", label: "Sponsored content: Not ready", description: "No authority or reach to attract sponsors.", priority: "high", status: "pending", notes: "", suggestion: "", category: "readiness" },
      { id: "mon-5", label: "No ad placement strategy", description: "Need to plan ad locations (in-content, sidebar, footer only).", priority: "medium", status: "pending", notes: "", suggestion: "", category: "strategy" },
    ]
  },
  {
    id: "strategy",
    title: "8. Content Strategy Improvements",
    icon: Target,
    score: 15,
    notes: "",
    expanded: false,
    items: [
      { id: "strat-1", label: "No clear niche focus", description: "Mixing football, tech, and make-money — too broad for authority.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "strategy" },
      { id: "strat-2", label: "No keyword research evident", description: "Content not targeting specific low-competition keywords.", priority: "high", status: "pending", notes: "", suggestion: "", category: "seo" },
      { id: "strat-3", label: "No content pillar structure", description: "Need pillar pages with supporting cluster content.", priority: "high", status: "pending", notes: "", suggestion: "", category: "strategy" },
      { id: "strat-4", label: "No publishing schedule", description: "Posts were all published within 3 days — no consistent schedule.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "strategy" },
      { id: "strat-5", label: "No evergreen content focus", description: "World Cup article is time-bound. Need more timeless content.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "strategy" },
    ]
  },
  {
    id: "ai-risk",
    title: "9. AI Content Detection Risk",
    icon: Brain,
    score: 5,
    notes: "",
    expanded: false,
    items: [
      { id: "ai-1", label: "95%+ AI detection probability", description: "All 3 articles would be flagged by Originality.ai / GPTZero.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "risk" },
      { id: "ai-2", label: "Formulaic structure in all articles", description: "مقدمة → قائمة → نصائح → خلاصة — identical AI template.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "risk" },
      { id: "ai-3", label: "Overused AI Arabic filler phrases", description: "'في عصر السرعة الرقمية', 'في عصرنا الرقمي المتسارع' repeated.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "risk" },
      { id: "ai-4", label: "Zero personal experience signals", description: "No 'I', 'we tested', 'in our experience' — always third-person.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "risk" },
      { id: "ai-5", label: "AI-hallucinated nonsense phrase", description: "'المال أعرف من إنترنت الذكاء الاصطناعي' is nonsensical Arabic.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "risk" },
      { id: "ai-6", label: "No concrete examples or screenshots", description: "All advice is theoretical with zero real demonstrations.", priority: "high", status: "pending", notes: "", suggestion: "", category: "risk" },
      { id: "ai-7", label: "FAQ sections on every article", description: "Classic AI content hallmark. FAQs feel tacked-on.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "risk" },
    ]
  },
  {
    id: "action-plan",
    title: "10. Final Action Plan",
    icon: ClipboardList,
    score: 0,
    notes: "",
    expanded: false,
    items: [
      { id: "plan-1", label: "Register custom domain", description: "Get matricblog.com or similar. Critical trust signal.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "infrastructure" },
      { id: "plan-2", label: "Write 25-30 original articles", description: "No AI. Focus on live streaming + football niche. 1500+ words each.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "plan-3", label: "Fix sitemap double slash bug", description: "Remove trailing slash from SITE_URL env var.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "bug" },
      { id: "plan-4", label: "Fix blog listing SSR", description: "Debug why /blog server-side fetch fails.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "bug" },
      { id: "plan-5", label: "Remove fake contact info", description: "Replace fake WhatsApp/Twitter with real or 'coming soon'.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "plan-6", label: "Fix About page lies", description: "Remove 'ملايين القراء' — write honest description.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "plan-7", label: "Rewrite 3 existing articles", description: "Humanize: add personal experience, data, screenshots.", priority: "critical", status: "pending", notes: "", suggestion: "", category: "content" },
      { id: "plan-8", label: "Create author profiles with real bios/photos", description: "E-E-A-T requirement: show real human authors.", priority: "high", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "plan-9", label: "Add Organization + Website schema", description: "To homepage for brand authority.", priority: "high", status: "pending", notes: "", suggestion: "", category: "seo" },
      { id: "plan-10", label: "Create real social media presence", description: "Twitter/X and YouTube with regular posts.", priority: "high", status: "pending", notes: "", suggestion: "", category: "trust" },
      { id: "plan-11", label: "Replace <img> with next/image", description: "For automatic optimization and lazy loading.", priority: "high", status: "pending", notes: "", suggestion: "", category: "performance" },
      { id: "plan-12", label: "Add breadcrumb structured data", description: "BreadcrumbList schema on all pages.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "seo" },
      { id: "plan-13", label: "Add comments section", description: "Disqus or custom comment system for engagement.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "engagement" },
      { id: "plan-14", label: "Apply for AdSense after 90 days", description: "After 60+ articles, real traffic, all fixes applied.", priority: "medium", status: "pending", notes: "", suggestion: "", category: "goal" },
    ]
  }
];

function saveToStorage(sections: AuditSection[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("matric-audit", JSON.stringify(sections));
  } catch {}
}

function loadFromStorage(): AuditSection[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("matric-audit");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

type SortKey = "priority" | "status" | "category";
type FilterKey = "all" | ItemStatus | "critical" | "high";

export default function AdminAuditPage() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const [sections, setSections] = useState<AuditSection[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<FilterKey>("all");
  const [globalSort, setGlobalSort] = useState<SortKey>("priority");
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestText, setSuggestText] = useState("");
  const [suggestCategory, setSuggestCategory] = useState("general");
  const [suggestions, setSuggestions] = useState<{ text: string; category: string; time: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // AI Analysis state
  const [analysisResult, setAnalysisResult] = useState<AuditAnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState("");

  const runAnalysis = useCallback(async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setAnalysisProgress("جارٍ فحص الصفحات...");
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
      setAnalysisProgress("");

      // Auto-populate checklist items based on results
      const data: AuditAnalysisResult = json.data;
      const updates: Record<string, ItemStatus> = {};

      // Mark items as done based on analysis
      if (data.sitemap.accessible) updates["plan-3"] = "done";
      if (data.robots.accessible) updates["seo-1"] = "done";
      if (data.trust.hasPrivacyPolicy) updates["trust-4"] = "done";
      if (data.trust.hasTermsOfService) updates["trust-4"] = "done";
      if (data.trust.hasContactPage) updates["trust-2"] = "in_progress";
      if (data.content.articleCount >= 3) updates["adsense-1"] = "in_progress";
      if (data.content.articleCount >= 25) updates["adsense-1"] = "done";
      if (data.content.aiProbability < 50) updates["adsense-3"] = "in_progress";
      if (data.content.hasPersonalVoice) updates["ai-4"] = "done";
      if (data.content.hasDataOrStats) updates["ai-6"] = "in_progress";
      if (data.pages.some(p => p.schemaTypes.includes("BreadcrumbList"))) updates["seo-3"] = "done";
      if (data.pages.some(p => p.schemaTypes.includes("Organization") || p.schemaTypes.includes("WebSite"))) updates["seo-4"] = "done";
      if (data.performance.hasNextImage) updates["perf-1"] = "done";

      setSections(prev => prev.map(s => ({
        ...s,
        items: s.items.map(i => ({
          ...i,
          status: updates[i.id] || i.status,
        }))
      })));
    } catch (err: any) {
      setAnalysisError(err.message || "فشل التحليل");
      setAnalysisProgress("");
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setSections(saved);
    } else {
      setSections(DEFAULT_SECTIONS.map(s => ({ ...s, items: s.items.map(i => ({ ...i })) })));
    }
    const savedSuggestions = localStorage.getItem("matric-audit-suggestions");
    if (savedSuggestions) {
      try { setSuggestions(JSON.parse(savedSuggestions)); } catch {}
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) saveToStorage(sections);
  }, [sections, initialized]);

  useEffect(() => {
    localStorage.setItem("matric-audit-suggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  const updateItem = useCallback((sectionId: string, itemId: string, updates: Partial<AuditItem>) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: s.items.map(i => i.id === itemId ? { ...i, ...updates } : i)
      };
    }));
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, expanded: !s.expanded } : s));
  }, []);

  const updateSectionNotes = useCallback((sectionId: string, notes: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, notes } : s));
  }, []);

  const toggleItemStatus = useCallback((sectionId: string, itemId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        items: s.items.map(i => {
          if (i.id !== itemId) return i;
          const next: Record<ItemStatus, ItemStatus> = { pending: "in_progress", in_progress: "done", done: "pending" };
          return { ...i, status: next[i.status] };
        })
      };
    }));
  }, []);

  const resetAudit = useCallback(() => {
    if (confirm("Reset all audit progress? This cannot be undone.")) {
      setSections(DEFAULT_SECTIONS.map(s => ({ ...s, items: s.items.map(i => ({ ...i, status: "pending" as ItemStatus, notes: "", suggestion: "" })), notes: "" })));
      setSuggestions([]);
    }
  }, []);

  const addSuggestion = useCallback(() => {
    if (!suggestText.trim()) return;
    setSuggestions(prev => [...prev, { text: suggestText, category: suggestCategory, time: new Date().toLocaleString("ar") }]);
    setSuggestText("");
    setShowSuggestModal(false);
  }, [suggestText, suggestCategory]);

  const exportReport = useCallback(() => {
    const totalItems = sections.reduce((a, s) => a + s.items.length, 0);
    const doneItems = sections.reduce((a, s) => a + s.items.filter(i => i.status === "done").length, 0);
    const inProgressItems = sections.reduce((a, s) => a + s.items.filter(i => i.status === "in_progress").length, 0);
    const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
    const approvalBefore = 5;
    const approvalAfter = Math.min(90, pct);

    let md = `# MatricBlog — AdSense Audit Report\n\n`;
    md += `**Generated:** ${new Date().toLocaleString("ar")}\n`;
    md += `**Website:** https://matric-blogs-26.vercel.app\n\n`;
    md += `## Overall Progress\n\n`;
    md += `- **${doneItems} / ${totalItems}** items completed (${pct}%)\n`;
    md += `- **${inProgressItems}** items in progress\n`;
    md += `- Approval probability before fixes: **${approvalBefore}%**\n`;
    md += `- Estimated approval after fixes: **${approvalAfter}%**\n\n`;

    for (const section of sections) {
      const sDone = section.items.filter(i => i.status === "done").length;
      const sTotal = section.items.length;
      md += `## ${section.title}\n\n`;
      md += `Progress: ${sDone}/${sTotal}\n\n`;
      for (const item of section.items) {
        const statusIcon = item.status === "done" ? "✅" : item.status === "in_progress" ? "🔄" : "⬜";
        const priorityLabel = item.priority === "critical" ? "🔴" : item.priority === "high" ? "🟠" : item.priority === "medium" ? "🟡" : "🟢";
        md += `### ${statusIcon} ${item.label}\n\n`;
        md += `- **Description:** ${item.description}\n`;
        md += `- **Priority:** ${priorityLabel} ${item.priority}\n`;
        md += `- **Status:** ${item.status}\n`;
        if (item.notes) md += `- **Notes:** ${item.notes}\n`;
        if (item.suggestion) md += `- **Suggestion:** ${item.suggestion}\n`;
        md += `\n`;
      }
    }

    if (suggestions.length > 0) {
      md += `## User Suggestions\n\n`;
      for (const s of suggestions) {
        md += `- [${s.category}] ${s.text} (${s.time})\n`;
      }
      md += `\n`;
    }

    md += `---\n*Report generated by MatricBlog Admin Audit Tool*\n`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adsense-audit-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sections, suggestions]);

  if (authLoading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex items-center gap-2 text-white/30 text-sm">
        <div className="w-4 h-4 border-2 border-red-500/50 border-t-red-500 rounded-full animate-spin" />
        جاري التحقق...
      </div>
    </div>
  );

  const totalItems = sections.reduce((a, s) => a + s.items.length, 0);
  const doneItems = sections.reduce((a, s) => a + s.items.filter(i => i.status === "done").length, 0);
  const inProgressItems = sections.reduce((a, s) => a + s.items.filter(i => i.status === "in_progress").length, 0);
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const priorityOrder: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const allItems = sections.flatMap(s => s.items.map(i => ({ ...i, sectionTitle: s.title, sectionId: s.id })));

  const filtered = allItems.filter(item => {
    if (globalFilter !== "all" && globalFilter !== "critical" && globalFilter !== "high") {
      if (item.status !== globalFilter) return false;
    }
    if (globalFilter === "critical" && item.priority !== "critical") return false;
    if (globalFilter === "high" && item.priority !== "critical" && item.priority !== "high") return false;
    if (searchQuery && !item.label.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (globalSort === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (globalSort === "status") return a.status.localeCompare(b.status);
    return a.category.localeCompare(b.category);
  });

  const getApprovalProbability = () => {
    const criticalDone = sections.flatMap(s => s.items).filter(i => i.priority === "critical" && i.status === "done").length;
    const criticalTotal = sections.flatMap(s => s.items).filter(i => i.priority === "critical").length;
    if (criticalTotal === 0) return 90;
    const ratio = criticalDone / criticalTotal;
    if (ratio < 0.3) return 5;
    if (ratio < 0.6) return 15;
    if (ratio < 0.8) return 30;
    if (ratio < 1) return 50;
    const highDone = sections.flatMap(s => s.items).filter(i => i.priority === "high" && i.status === "done").length;
    const highTotal = sections.flatMap(s => s.items).filter(i => i.priority === "high").length;
    const highRatio = highTotal > 0 ? highDone / highTotal : 1;
    if (highRatio < 0.5) return 60;
    return 80 + Math.round((doneItems / totalItems) * 10);
  };

  const approvalPct = getApprovalProbability();

  const getStatusBadge = (status: ItemStatus) => {
    if (status === "done") return <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium"><CheckCircle2 className="w-3 h-3" /> تم</span>;
    if (status === "in_progress") return <span className="flex items-center gap-1 text-xs text-amber-400 font-medium"><AlertCircle className="w-3 h-3" /> قيد العمل</span>;
    return <span className="flex items-center gap-1 text-xs text-white/30 font-medium"><Circle className="w-3 h-3" /> معلق</span>;
  };

  const getPriorityBadge = (priority: Priority) => {
    const m: Record<Priority, { label: string; className: string }> = {
      critical: { label: "حرج", className: "bg-red-500/15 text-red-400 border-red-500/20" },
      high: { label: "عالي", className: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
      medium: { label: "متوسط", className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
      low: { label: "منخفض", className: "bg-green-500/15 text-green-400 border-green-500/20" },
    };
    const b = m[priority];
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${b.className}`}>{b.label}</span>;
  };

  return (
    <div className="min-h-screen bg-[#080808] flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-white/30 uppercase tracking-widest font-mono">AdSense Audit Panel</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">فحص AdSense الشامل</h1>
              <p className="text-sm text-white/40 mt-1">تدقيق متكامل لاستعداد الموقع لموافقة Google AdSense</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={runAnalysis}
                disabled={analysisLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-emerald-500/30 disabled:to-emerald-600/30 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
              >
                {analysisLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ScanLine className="w-4 h-4" />
                )}
                {analysisLoading ? "جارٍ التحليل..." : "تحليل AI"}
              </button>
              <button
                onClick={resetAudit}
                className="px-3 py-2 text-xs text-white/30 hover:text-red-400 border border-white/10 rounded-xl hover:border-red-500/30 transition-all"
              >
                إعادة تعيين
              </button>
              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-500/25"
              >
                <Download className="w-4 h-4" />
                تصدير التقرير
              </button>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/5 border border-white/[0.06] p-4">
              <p className="text-xs text-white/40 mb-1">الإنجاز الكلي</p>
              <p className="text-2xl font-black text-white">{pct}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-l from-red-500 to-rose-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-white/30 mt-1">{doneItems} / {totalItems} مهمة</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-white/[0.06] p-4">
              <p className="text-xs text-white/40 mb-1">تم الإنجاز</p>
              <p className="text-2xl font-black text-emerald-400">{doneItems}</p>
              <p className="text-[10px] text-white/30 mt-1">مهمة مكتملة</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-white/[0.06] p-4">
              <p className="text-xs text-white/40 mb-1">قيد العمل</p>
              <p className="text-2xl font-black text-amber-400">{inProgressItems}</p>
              <p className="text-[10px] text-white/30 mt-1">مهمة جارية</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-white/[0.06] p-4">
              <p className="text-xs text-white/40 mb-1">احتمال الموافقة</p>
              <p className="text-2xl font-black text-blue-400">{approvalPct}%</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-l from-blue-500 to-cyan-500 transition-all duration-500" style={{ width: `${approvalPct}%` }} />
              </div>
              <p className="text-[10px] text-white/30 mt-1">تقدير بعد الإصلاحات</p>
            </div>
          </div>

          {/* AI Analysis Results */}
          {analysisLoading && (
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 md:p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-sm font-bold text-white">تحليل الموقع...</span>
              </div>
              <p className="text-xs text-white/40">{analysisProgress || "جارٍ فحص وتحليل الصفحات"}</p>
              <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-400 animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {analysisError && (
            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-4 md:p-5 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Bug className="w-4 h-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">فشل التحليل</span>
              </div>
              <p className="text-xs text-white/50">{analysisError}</p>
              <button onClick={runAnalysis} className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                إعادة المحاولة
              </button>
            </div>
          )}

          {analysisResult && (
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 md:p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">نتائج التحليل الآلي</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">Live</span>
                </div>
                <button onClick={runAnalysis} disabled={analysisLoading} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  <RefreshCw className="w-3 h-3" />
                  تحديث
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div className="bg-white/[0.03] rounded-xl p-3">
                  <p className="text-[10px] text-white/30">الصفحات الممسوحة</p>
                  <p className="text-lg font-black text-white">{analysisResult.summary.pagesScanned}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3">
                  <p className="text-[10px] text-white/30">المشاكل المكتشفة</p>
                  <p className="text-lg font-black text-red-400">{analysisResult.summary.totalIssues}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3">
                  <p className="text-[10px] text-white/30">مشاكل حرجة</p>
                  <p className="text-lg font-black text-rose-400">{analysisResult.summary.criticalIssues}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3">
                  <p className="text-[10px] text-white/30">احتمال الموافقة</p>
                  <p className="text-lg font-black text-emerald-400">{analysisResult.summary.approvalProbability}%</p>
                </div>
              </div>

              {/* Preview of found issues */}
              {analysisResult.summary.totalIssues > 0 && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {analysisResult.summary.criticalIssues > 0 && (
                    <div className="mb-1">
                      <p className="text-[10px] text-red-400 font-semibold mb-1">🔴 حرجة ({analysisResult.summary.criticalIssues})</p>
                      {analysisResult.pages.flatMap(p => p.issues.filter(i => i.type === "critical")).slice(0, 5).map((issue, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-white/60 py-0.5">
                          <div className="w-1 h-1 rounded-full bg-red-400 mt-1 shrink-0" />
                          <span>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {analysisResult.content.issues.filter(i => i.type === "critical").slice(0, 3).map((issue, i) => (
                    <div key={`c-${i}`} className="flex items-start gap-1.5 text-[11px] text-white/60 py-0.5">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1 shrink-0" />
                      <span>{issue.message}</span>
                    </div>
                  ))}
                  {analysisResult.seo.issues.filter(i => i.type === "critical").slice(0, 3).map((issue, i) => (
                    <div key={`s-${i}`} className="flex items-start gap-1.5 text-[11px] text-white/60 py-0.5">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1 shrink-0" />
                      <span>{issue.message}</span>
                    </div>
                  ))}
                  {analysisResult.trust.issues.filter(i => i.type === "critical").slice(0, 3).map((issue, i) => (
                    <div key={`t-${i}`} className="flex items-start gap-1.5 text-[11px] text-white/60 py-0.5">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1 shrink-0" />
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-1.5">
              <FileSearch className="w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                placeholder="بحث في المهام..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white/70 placeholder:text-white/20 border-none outline-none w-32"
              />
            </div>
            <select
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value as FilterKey)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-white/70 outline-none"
            >
              <option value="all">جميع المهام</option>
              <option value="pending">معلق</option>
              <option value="in_progress">قيد العمل</option>
              <option value="done">منجز</option>
              <option value="critical">حرج فقط</option>
              <option value="high">عالي + حرج</option>
            </select>
            <select
              value={globalSort}
              onChange={e => setGlobalSort(e.target.value as SortKey)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-white/70 outline-none"
            >
              <option value="priority">ترتيب: حسب الأولوية</option>
              <option value="status">ترتيب: حسب الحالة</option>
              <option value="category">ترتيب: حسب التصنيف</option>
            </select>
            <button
              onClick={() => setShowSuggestModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white/50 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              اقتراح إضافة
            </button>
          </div>

          {/* Sections Accordion */}
          <div className="space-y-3 mb-6">
            {sections.map(section => {
              const sDone = section.items.filter(i => i.status === "done").length;
              const sTotal = section.items.length;
              const pct = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0;
              const Icon = section.icon;
              const criticalCount = section.items.filter(i => i.priority === "critical" && i.status !== "done").length;

              return (
                <div key={section.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-3 p-4 md:p-5 hover:bg-white/[0.02] transition-colors text-right"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{section.title}</h3>
                        {criticalCount > 0 && (
                          <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">{criticalCount} حرج</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 max-w-[120px] h-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-l from-red-500 to-rose-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-white/30">{sDone}/{sTotal}</span>
                      </div>
                    </div>
                    {section.expanded ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                  </button>

                  {section.expanded && (
                    <div className="px-4 md:px-5 pb-4 space-y-2">
                      {/* Section Notes */}
                      <textarea
                        value={section.notes}
                        onChange={e => updateSectionNotes(section.id, e.target.value)}
                        placeholder="ملاحظات عامة على هذا القسم..."
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-xs text-white/60 placeholder:text-white/20 outline-none resize-none h-16"
                      />

                      {/* Items */}
                      <div className="space-y-1">
                        {section.items
                          .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
                          .map(item => (
                            <div key={item.id} className="group rounded-xl border border-white/[0.04] hover:border-white/[0.08] bg-white/[0.01] p-3 transition-all">
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleItemStatus(section.id, item.id)}
                                  className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
                                  title="تغيير الحالة"
                                >
                                  {item.status === "done" ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : item.status === "in_progress" ? (
                                    <AlertCircle className="w-4 h-4 text-amber-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-white/80">{item.label}</span>
                                    {getPriorityBadge(item.priority)}
                                    {getStatusBadge(item.status)}
                                  </div>
                                  <p className="text-xs text-white/40 mt-0.5">{item.description}</p>

                                  {/* Quick action fields */}
                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={item.notes}
                                      onChange={e => updateItem(section.id, item.id, { notes: e.target.value })}
                                      placeholder="ملاحظات..."
                                      className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[11px] text-white/50 placeholder:text-white/15 outline-none"
                                    />
                                    <input
                                      type="text"
                                      value={item.suggestion}
                                      onChange={e => updateItem(section.id, item.id, { suggestion: e.target.value })}
                                      placeholder="اقتراح تحسين..."
                                      className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[11px] text-white/50 placeholder:text-white/15 outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Suggestions Section */}
          {suggestions.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">اقتراحات المستخدم</h3>
                <span className="text-xs text-white/30">({suggestions.length})</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/60 bg-white/[0.02] rounded-xl p-3">
                    <div className="w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ThumbsUp className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                    <div>
                      <p>{s.text}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">[{s.category}] {s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick View: All critical items */}
          <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm text-white">المهام الحرجة المتبقية</h3>
            </div>
            <div className="space-y-1">
              {sections.flatMap(s => s.items.filter(i => i.priority === "critical" && i.status !== "done")).length === 0 ? (
                <p className="text-xs text-emerald-400">جميع المهام الحرجة مكتملة! ✅</p>
              ) : (
                sections.flatMap(s => s.items.filter(i => i.priority === "critical" && i.status !== "done")).slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggest Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowSuggestModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0e0e0e] p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">إضافة اقتراح</h3>
              <button onClick={() => setShowSuggestModal(false)} className="text-white/30 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={suggestText}
              onChange={e => setSuggestText(e.target.value)}
              placeholder="ماذا يجب إضافته إلى التدقيق؟"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-sm text-white/70 placeholder:text-white/20 outline-none resize-none h-24 mb-3"
              autoFocus
            />
            <select
              value={suggestCategory}
              onChange={e => setSuggestCategory(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white/70 outline-none mb-4"
            >
              <option value="general">عام</option>
              <option value="content">محتوى</option>
              <option value="seo">SEO</option>
              <option value="design">تصميم</option>
              <option value="trust">ثقة</option>
              <option value="performance">أداء</option>
              <option value="strategy">استراتيجية</option>
              <option value="legal">قانوني</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSuggestModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={addSuggestion}
                disabled={!suggestText.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/30 disabled:text-white/30 text-white text-sm font-bold rounded-xl transition-all"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
