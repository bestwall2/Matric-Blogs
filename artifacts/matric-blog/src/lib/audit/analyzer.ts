import type {
  AuditAnalysisResult, PageAnalysis, Issue,
  SitemapResult, RobotsResult, ContentAnalysis,
  SEOAnalysis, TrustAnalysis, PerformanceAnalysis
} from "./types";
import {
  AI_FILLER_PHRASES_AR, OPENER_SIGNATURES,
  AI_STRUCTURE_PATTERNS, HUMAN_SIGNALS,
  FIRST_PERSON_PRONOUNS, DATA_PATTERNS
} from "./patterns";

function makeIssue(type: Issue["type"], category: string, message: string, detail: string, suggestion: string): Issue {
  return { type, category, message, detail, suggestion };
}

function extractMeta(html: string, name: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1] : null;
}

function extractCanonical(html: string): string | null {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function extractJsonLd(html: string): string[] {
  const results: string[] = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    results.push(m[1].trim());
  }
  return results;
}

function extractSchemaTypes(jsonLdBlocks: string[]): string[] {
  const types: string[] = [];
  for (const block of jsonLdBlocks) {
    const m = block.match(/"@type"\s*:\s*"([^"]+)"/);
    if (m) types.push(m[1]);
    // Also check for graph arrays
    const graphM = block.match(/"@graph"\s*:/);
    if (graphM) {
      const itemMatches = block.match(/"@type"\s*:\s*"([^"]+)"/g);
      if (itemMatches) {
        itemMatches.forEach(im => {
          const t = im.match(/"@type"\s*:\s*"([^"]+)"/);
          if (t && !types.includes(t[1])) types.push(t[1]);
        });
      }
    }
  }
  return [...new Set(types)];
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>(.*?)<\\/h${i}>`, "gi");
    let m;
    while ((m = regex.exec(html)) !== null) {
      headings.push(`h${i}: ${m[1].replace(/<[^>]+>/g, "").trim()}`);
    }
  }
  return headings;
}

function extractWordCount(html: string): number {
  const body = html.match(/<body[^>]*>[\s\S]*<\/body>/i);
  if (!body) return 0;
  const text = body[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // For Arabic: count words split by whitespace
  const words = text.split(/\s+/).filter(w => w.length > 0 && /[\u0600-\u06FFa-zA-Z]/.test(w));
  return words.length;
}

function hasAuthorInArticle(html: string): boolean {
  return /author/i.test(html) && (/"@type"\s*:\s*"Person"/.test(html) || /article:author/i.test(html) || /author-name/i.test(html));
}

function hasDateInArticle(html: string): boolean {
  return /datePublished|published_at|published_at|dateModified|تاري/.test(html);
}

function detectAIPatterns(html: string): { probability: number; signals: string[]; fillerPhrases: string[] } {
  const body = html.match(/<body[^>]*>[\s\S]*<\/body>/i);
  const text = body ? body[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
  const signals: string[] = [];
  const fillerPhrases: string[] = [];

  // Check filler phrases
  for (const phrase of AI_FILLER_PHRASES_AR) {
    if (text.includes(phrase)) {
      fillerPhrases.push(phrase);
    }
  }

  // Check opener signatures
  for (const sig of OPENER_SIGNATURES) {
    if (text.startsWith(sig) || text.indexOf(sig) < 200) {
      signals.push(`Generic AI opener: "${sig}"`);
      break;
    }
  }

  // Check structure patterns in headings
  const headings = extractHeadings(html);
  for (const pattern of AI_STRUCTURE_PATTERNS) {
    if (headings.some(h => h.includes(pattern))) {
      signals.push(`AI structure pattern: "${pattern}" in headings`);
    }
  }

  // Check for FAQ section
  if (/الأسئلة الشائعة|FAQ/i.test(text)) {
    signals.push("FAQ section found — common AI content signature");
  }

  // Check human signals (lack of)
  const humanSignalCount = HUMAN_SIGNALS.filter(s => text.includes(s)).length;
  if (humanSignalCount < 2) {
    signals.push(`Very few personal experience signals (${humanSignalCount} found, need 2+)`);
  }

  // Check first person pronouns
  const firstPersonCount = FIRST_PERSON_PRONOUNS.filter(p => text.includes(p)).length;
  if (firstPersonCount < 1) {
    signals.push("No first-person pronouns — content reads as impersonal/generated");
  }

  // Check for data patterns
  const dataCount = DATA_PATTERNS.filter(p => p.test(text)).length;
  if (dataCount < 1) {
    signals.push("No statistics, data, or numbers found");
  }

  // Calculate probability
  let probability = 0;
  if (fillerPhrases.length > 5) probability += 25;
  else if (fillerPhrases.length > 2) probability += 15;
  if (signals.length > 4) probability += 30;
  else if (signals.length > 2) probability += 20;
  if (humanSignalCount < 2) probability += 20;
  if (firstPersonCount < 1) probability += 15;
  if (dataCount < 1) probability += 10;
  probability = Math.min(99, probability);

  return { probability, signals, fillerPhrases };
}

async function crawlPage(url: string): Promise<{ html: string; status: number } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const html = await res.text();
    return { html, status: res.status };
  } catch {
    return null;
  }
}

export async function analyzeSite(siteUrl: string): Promise<AuditAnalysisResult> {
  const issues: Issue[] = [];
  const pageAnalyses: PageAnalysis[] = [];

  // Normalize URL
  const baseUrl = siteUrl.replace(/\/+$/, "");

  // Define pages to crawl
  const pagesToCrawl = [
    { url: baseUrl, name: "Homepage" },
    { url: `${baseUrl}/blog`, name: "Blog Listing" },
    { url: `${baseUrl}/about`, name: "About" },
    { url: `${baseUrl}/contact`, name: "Contact" },
    { url: `${baseUrl}/privacy`, name: "Privacy" },
    { url: `${baseUrl}/terms`, name: "Terms" },
  ];

  // Try to discover article slugs from sitemap
  let articleSlugs: string[] = [];
  try {
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(8000) });
    if (sitemapRes.ok) {
      const sitemapXml = await sitemapRes.text();
      const slugRegex = /<loc>([^<]+\/blog\/[^<]+)<\/loc>/g;
      let sm;
      while ((sm = slugRegex.exec(sitemapXml)) !== null) {
        articleSlugs.push(sm[1]);
      }
    }
  } catch {}

  // Add up to 3 articles
  for (const slug of articleSlugs.slice(0, 3)) {
    pagesToCrawl.push({ url: slug, name: `Article: ${slug.split("/").pop()}` });
  }

  // Crawl each page
  let totalWordCount = 0;
  let articleCount = 0;
  let pagesWithAutoGenerated = 0;
  let metaIssues: Issue[] = [];

  for (const page of pagesToCrawl) {
    const result = await crawlPage(page.url);
    if (!result) {
      pageAnalyses.push({
        url: page.url,
        status: 0,
        title: null,
        metaDescription: null,
        ogTitle: null,
        ogDescription: null,
        ogType: null,
        ogImage: null,
        canonical: null,
        jsonLd: null,
        schemaTypes: [],
        wordCount: 0,
        hasH1: false,
        headingStructure: [],
        hasAuthor: false,
        hasDate: false,
        hasAutoGenerated: false,
        issues: [makeIssue("critical", "crawl", `Failed to fetch ${page.name}`, `URL: ${page.url}`, "Check server logs and verify the URL is accessible")],
      });
      continue;
    }

    const { html, status } = result;
    const title = extractTitle(html);
    const metaDescription = extractMeta(html, "description") || extractMeta(html, "og:description");
    const ogTitle = extractMeta(html, "og:title");
    const ogDescription = extractMeta(html, "og:description");
    const ogType = extractMeta(html, "og:type");
    const ogImage = extractMeta(html, "og:image");
    const canonical = extractCanonical(html);
    const jsonLdBlocks = extractJsonLd(html);
    const schemaTypes = extractSchemaTypes(jsonLdBlocks);
    const headings = extractHeadings(html);
    const wordCount = extractWordCount(html);
    const hasH1 = headings.some(h => h.startsWith("h1:"));
    const hasAuthor = hasAuthorInArticle(html);
    const hasDate = hasDateInArticle(html);
    const aiDetected = detectAIPatterns(html);
    const hasAutoGenerated = aiDetected.probability > 50;

    const pageIssues: Issue[] = [];
    let countedInArticle = false;

    // Check title
    if (!title || title.length < 10) {
      pageIssues.push(makeIssue("high", "meta", `Missing/empty title on ${page.name}`, title ? `Title: "${title}"` : "No title tag found", "Add a descriptive, unique title tag (30-60 chars)"));
    } else if (title.length > 70) {
      pageIssues.push(makeIssue("medium", "meta", `Title too long on ${page.name} (${title.length} chars)`, `Title: "${title}"`, "Keep titles under 60 characters for better SERP display"));
    }

    // Check meta description
    if (!metaDescription || metaDescription.length < 30) {
      pageIssues.push(makeIssue("high", "meta", `Missing/short meta description on ${page.name}`, metaDescription ? `Length: ${metaDescription.length}` : "No meta description", "Add a compelling meta description (120-165 chars)"));
    }

    // Check OG tags
    if (!ogTitle) {
      pageIssues.push(makeIssue("high", "meta", `Missing og:title on ${page.name}`, "", "og:title is required for social sharing"));
    }
    if (!ogDescription) {
      pageIssues.push(makeIssue("medium", "meta", `Missing og:description on ${page.name}`, "", "Add og:description for better social previews"));
    }

    // Check canonical
    if (!canonical) {
      pageIssues.push(makeIssue("medium", "seo", `Missing canonical URL on ${page.name}`, "", "Add canonical URL to prevent duplicate content issues"));
    }

    // Check JSON-LD
    if (page.name.startsWith("Article") && jsonLdBlocks.length === 0) {
      pageIssues.push(makeIssue("critical", "schema", `No JSON-LD on ${page.name}`, "", "Add Article schema for rich results"));
    }
    if (page.name === "Homepage" && !schemaTypes.includes("Organization") && !schemaTypes.includes("WebSite")) {
      pageIssues.push(makeIssue("high", "schema", "Missing Organization/WebSite schema on homepage", "", "Add Organization and WebSite schema for brand authority"));
    }

    // Check headings
    if (!hasH1) {
      pageIssues.push(makeIssue("high", "seo", `Missing H1 on ${page.name}`, "", "Each page needs exactly one H1"));
    }

    // Check word count
    if (page.name.startsWith("Article") && wordCount < 1000) {
      pageIssues.push(makeIssue("high", "content", `Thin content on ${page.name} (${wordCount} words)`, "", "Aim for 1500+ words per article"));
      countedInArticle = true;
    }

    // AI detection for articles
    if (page.name.startsWith("Article") && aiDetected.probability > 60) {
      pageIssues.push(makeIssue("critical", "content", `High AI probability (${aiDetected.probability}%) on ${page.name}`, `Signals: ${aiDetected.signals.slice(0, 3).join(", ")}`, "Rewrite with personal experience, data, and original research"));
      countedInArticle = true;
    }

    if (page.name.startsWith("Article")) {
      totalWordCount += wordCount;
      articleCount++;
      if (hasAutoGenerated) pagesWithAutoGenerated++;
    }

    pageAnalyses.push({
      url: page.url,
      status,
      title,
      metaDescription,
      ogTitle,
      ogDescription,
      ogType,
      ogImage,
      canonical,
      jsonLd: jsonLdBlocks[0] || null,
      schemaTypes,
      wordCount,
      hasH1,
      headingStructure: headings.slice(0, 10),
      hasAuthor,
      hasDate,
      hasAutoGenerated,
      issues: pageIssues,
    });

    metaIssues = [...metaIssues, ...pageIssues];
  }

  // ---- SITEMAP CHECK ----
  const sitemapIssues: Issue[] = [];
  let sitemapAccessible = false;
  let sitemapUrls: string[] = [];
  try {
    const smRes = await fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(8000) });
    if (smRes.ok) {
      sitemapAccessible = true;
      const xml = await smRes.text();
      const urlRegex = /<loc>([^<]+)<\/loc>/g;
      let um;
      while ((um = urlRegex.exec(xml)) !== null) {
        sitemapUrls.push(um[1]);
      }
      // Check for double slashes
      const doubleSlashUrls = sitemapUrls.filter(u => u.includes("//") && !u.startsWith("https://") && !u.startsWith("http://"));
      const domainSlashCount = sitemapUrls.filter(u => {
        const afterDomain = u.replace(/https?:\/\/[^\/]+/, "");
        return afterDomain.startsWith("//");
      }).length;
      if (domainSlashCount > 0) {
        sitemapIssues.push(makeIssue("critical", "seo", `Double slashes in ${domainSlashCount} sitemap URLs`, `Example: ${sitemapUrls.find(u => u.replace(/https?:\/\/[^\/]+/, "").startsWith("//"))}`, "Ensure SITE_URL env var has no trailing slash"));
      }
    } else {
      sitemapIssues.push(makeIssue("critical", "seo", "Sitemap not accessible", `Status: ${smRes.status}`, "Create sitemap.xml at /sitemap.xml"));
    }
  } catch {
    sitemapIssues.push(makeIssue("critical", "seo", "Sitemap fetch failed", "Connection error", "Ensure sitemap.xml is accessible"));
  }

  // ---- ROBOTS CHECK ----
  const robotsIssues: Issue[] = [];
  let robotsAccessible = false;
  let robotsContent = "";
  let robotsHasSitemap = false;
  try {
    const rbRes = await fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(8000) });
    if (rbRes.ok) {
      robotsAccessible = true;
      robotsContent = await rbRes.text();
      robotsHasSitemap = /sitemap/i.test(robotsContent);
      if (!robotsHasSitemap) {
        robotsIssues.push(makeIssue("high", "seo", "robots.txt missing Sitemap directive", "", "Add 'Sitemap: https://.../sitemap.xml' to robots.txt"));
      }
      if (!/Allow\s*:\s*\//i.test(robotsContent)) {
        robotsIssues.push(makeIssue("high", "seo", "robots.txt missing Allow: /", "", "Add 'Allow: /' so crawlers can access the site"));
      }
    } else {
      robotsIssues.push(makeIssue("critical", "seo", "robots.txt not accessible", `Status: ${rbRes.status}`, "Create robots.txt at /robots.txt"));
    }
  } catch {
    robotsIssues.push(makeIssue("critical", "seo", "robots.txt fetch failed", "Connection error", "Ensure robots.txt is accessible"));
  }

  // ---- CONTENT ANALYSIS ----
  const contentIssues: Issue[] = [];
  const allAISignals: string[] = [];
  const allFillerPhrases: string[] = [];
  let hasPersonalVoiceAny = false;
  let hasConcreteExamplesAny = false;
  let hasDataOrStatsAny = false;

  for (const page of pageAnalyses) {
    if (page.wordCount > 0) {
      try {
        const res = await fetch(page.url, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const html = await res.text();
          const ai = detectAIPatterns(html);
          if (ai.signals.length > 0) allAISignals.push(...ai.signals);
          if (ai.fillerPhrases.length > 0) allFillerPhrases.push(...ai.fillerPhrases);
          const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          hasPersonalVoiceAny = hasPersonalVoiceAny || HUMAN_SIGNALS.some(s => text.includes(s));
          hasConcreteExamplesAny = hasConcreteExamplesAny || /\bمثل\b|\bمثال\b|\bعلى سبيل المثال\b/i.test(text);
          hasDataOrStatsAny = hasDataOrStatsAny || DATA_PATTERNS.some(p => p.test(text));
        }
      } catch {}
    }
  }

  if (!hasPersonalVoiceAny) {
    contentIssues.push(makeIssue("critical", "content", "No personal experience signals across any page", "", "Add first-hand experience, opinions, and personal stories to articles"));
  }
  if (!hasDataOrStatsAny) {
    contentIssues.push(makeIssue("high", "content", "No statistics or data found on any page", "", "Include original data, statistics, and research to build authority"));
  }
  if (allAISignals.length > 5) {
    contentIssues.push(makeIssue("critical", "content", `${allAISignals.length} AI signals detected across pages`, `Sample: ${allAISignals.slice(0, 4).join("; ")}`, "Rewrite content to be more original and personal"));
  }

  // ---- SEO ANALYSIS ----
  const seoIssues: Issue[] = [...metaIssues.filter(i => i.category === "meta" || i.category === "seo" || i.category === "schema"), ...sitemapIssues, ...robotsIssues];
  const hasBreadcrumb = pageAnalyses.some(p => p.schemaTypes.includes("BreadcrumbList"));
  if (!hasBreadcrumb) {
    seoIssues.push(makeIssue("medium", "schema", "No BreadcrumbList schema found on any page", "", "Add breadcrumb structured data"));
  }

  // ---- TRUST ANALYSIS ----
  const trustIssues: Issue[] = [];
  const hasAbout = pageAnalyses.find(p => p.url.includes("/about"));
  const hasContact = pageAnalyses.find(p => p.url.includes("/contact"));
  const hasPrivacy = pageAnalyses.find(p => p.url.includes("/privacy"));
  const hasTerms = pageAnalyses.find(p => p.url.includes("/terms"));

  if (!hasAbout || hasAbout.status === 0) trustIssues.push(makeIssue("high", "trust", "About page missing or inaccessible", "", "Create an About page with team info and mission"));
  if (!hasContact || hasContact.status === 0) trustIssues.push(makeIssue("high", "trust", "Contact page missing or inaccessible", "", "Create a Contact page with real contact info"));
  if (!hasPrivacy || hasPrivacy.status === 0) trustIssues.push(makeIssue("critical", "trust", "Privacy policy missing", "", "Required by law and AdSense. Create privacy page."));
  if (!hasTerms || hasTerms.status === 0) trustIssues.push(makeIssue("medium", "trust", "Terms of service missing", "", "Create terms page to protect your business"));

  // Check author presence on articles
  const articlesWithAuthor = pageAnalyses.filter(p => p.url.includes("/blog/") && p.hasAuthor).length;
  const totalArticles = pageAnalyses.filter(p => p.url.includes("/blog/")).length;
  if (totalArticles > 0 && articlesWithAuthor < totalArticles) {
    trustIssues.push(makeIssue("critical", "trust", `Only ${articlesWithAuthor}/${totalArticles} articles have author info`, "", "Add author name, bio, photo, and social links to every article"));
  }

  // Check contact methods
  const contactPage = pageAnalyses.find(p => p.url.includes("/contact"));
  const contactMethods: string[] = [];
  if (contactPage) {
    try {
      const res = await fetch(contactPage.url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const html = await res.text();
        if (/@/.test(html)) contactMethods.push("email");
        if (/whatsapp|واتس/i.test(html)) contactMethods.push("whatsapp");
        if (/twitter|x\.com/i.test(html)) contactMethods.push("twitter");
        if (/عنوان|address|مكتب/i.test(html)) contactMethods.push("address");
      }
    } catch {}
  }

  // ---- PERFORMANCE ANALYSIS ----
  const perfIssues: Issue[] = [];
  let imageCount = 0;
  let hasNextImage = false;
  let hasExplicitDimensions = false;

  for (const page of pageAnalyses) {
    try {
      const res = await fetch(page.url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const html = await res.text();
        const imgTags = html.match(/<img[^>]+>/gi) || [];
        imageCount += imgTags.length;
        if (/next-image/i.test(html)) hasNextImage = true;
        if (/width\s*=|height\s*=/i.test(html)) hasExplicitDimensions = true;
      }
    } catch {}
  }

  if (!hasNextImage && imageCount > 0) {
    perfIssues.push(makeIssue("high", "performance", `Using <img> instead of next/image for ${imageCount} images`, "", "Replace <img> with next/image for automatic optimization"));
  }
  if (!hasExplicitDimensions && imageCount > 0) {
    perfIssues.push(makeIssue("medium", "performance", "Images missing explicit width/height", "", "Add width and height to prevent Cumulative Layout Shift"));
  }

  // ---- COMPILE RESULTS ----
  const allIssues = [...metaIssues, ...sitemapIssues, ...robotsIssues, ...contentIssues, ...seoIssues, ...trustIssues, ...perfIssues];
  const criticalCount = allIssues.filter(i => i.type === "critical").length;
  const highCount = allIssues.filter(i => i.type === "high").length;
  const mediumCount = allIssues.filter(i => i.type === "medium").length;

  // Calculate approval probability
  let approvalProb = 5;
  if (sitemapAccessible && robotsAccessible) approvalProb += 5;
  if (hasPrivacy && hasTerms) approvalProb += 5;
  if (articleCount >= 3) approvalProb += 3;
  if (articleCount >= 10) approvalProb += 5;
  if (articleCount >= 25) approvalProb += 10;
  if (allAISignals.length < 3) approvalProb += 10;
  if (criticalCount === 0) approvalProb += 20;
  if (highCount < 3) approvalProb += 10;
  if (hasPersonalVoiceAny) approvalProb += 5;
  if (hasAbout && hasContact) approvalProb += 5;
  if (articleCount > 0) {
    const avgWc = totalWordCount / articleCount;
    if (avgWc > 1500) approvalProb += 10;
  }
  if (hasNextImage) approvalProb += 2;
  approvalProb = Math.min(95, Math.max(1, approvalProb));

  return {
    url: baseUrl,
    timestamp: new Date().toISOString(),
    score: Math.round((100 - allIssues.length * 1.5 + approvalProb) / 2),
    summary: {
      totalIssues: allIssues.length,
      criticalIssues: criticalCount,
      highIssues: highCount,
      mediumIssues: mediumCount,
      pagesScanned: pageAnalyses.length,
      approvalProbability: approvalProb,
    },
    pages: pageAnalyses,
    sitemap: {
      accessible: sitemapAccessible,
      urlCount: sitemapUrls.length,
      urls: sitemapUrls,
      issues: sitemapIssues,
    },
    robots: {
      accessible: robotsAccessible,
      content: robotsContent,
      hasSitemap: robotsHasSitemap,
      issues: robotsIssues,
    },
    content: {
      aiProbability: allAISignals.length > 0 ? Math.min(99, allAISignals.length * 8) : 0,
      aiSignals: [...new Set(allAISignals)],
      fillerPhrases: [...new Set(allFillerPhrases)],
      hasPersonalVoice: hasPersonalVoiceAny,
      hasConcreteExamples: hasConcreteExamplesAny,
      hasDataOrStats: hasDataOrStatsAny,
      articleCount,
      avgWordCount: articleCount > 0 ? Math.round(totalWordCount / articleCount) : 0,
      issues: contentIssues,
    },
    seo: {
      metaTagsScore: Math.max(0, 100 - metaIssues.filter(i => i.category === "meta").length * 15),
      schemaScore: Math.max(0, 100 - (pageAnalyses.some(p => p.schemaTypes.length > 0) ? 10 : 50)),
      sitemapScore: sitemapAccessible ? (sitemapIssues.length > 0 ? 50 : 100) : 0,
      internalLinks: articleSlugs.length,
      issues: seoIssues,
    },
    trust: {
      hasPrivacyPolicy: !!hasPrivacy && hasPrivacy.status !== 0,
      hasTermsOfService: !!hasTerms && hasTerms.status !== 0,
      hasContactPage: !!hasContact && hasContact.status !== 0,
      hasAboutPage: !!hasAbout && hasAbout.status !== 0,
      hasAuthorBios: articlesWithAuthor > 0,
      hasSocialLinks: pageAnalyses.some(p => {
        try {
          return /social|twitter|facebook|instagram/i.test(p.url);
        } catch { return false; }
      }),
      hasBusinessInfo: false,
      contactMethods,
      issues: trustIssues,
    },
    performance: {
      hasNextImage,
      hasExplicitDimensions,
      imageCount,
      scriptsSize: "Not measured (server-side analysis limited)",
      issues: perfIssues,
    },
  };
}
