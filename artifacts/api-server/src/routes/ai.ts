import { Router, type IRouter } from "express";
import { AiGeneratePostBody, AiImproveContentBody } from "@workspace/api-zod";
import { callGeminiJson, parseJsonLoose } from "../lib/gemini";
import { adminAuth } from "../middleware/adminAuth";

const router: IRouter = Router();

router.post("/ai/generate", adminAuth, async (req, res): Promise<void> => {
  const body = AiGeneratePostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const {
    topic,
    language,
    type,
    length,
    tone,
    keyword,
    includeFAQ,
    includeTOC,
    instructions,
  } = body.data;

  const wordCount = { short: 500, medium: 1000, long: 2000 }[length];

  const systemPrompt = `You are an expert blog writer and SEO specialist. You write high-quality,
Google AdSense-approved content. Your content is:
- 100% original and human-like
- Well-structured with proper H2/H3 headings
- SEO-optimized with natural keyword usage (not keyword stuffing)
- Informative, accurate, and valuable to readers
- Free of any content that violates Google policies
- Written in a ${tone} tone
You return ONLY valid JSON, no markdown fences, no preamble.`;

  const userPrompt = `Write a complete blog article about: "${topic}"

Requirements:
- Language: ${language}
- Article type: ${type}
- Target word count: approximately ${wordCount} words
- Focus keyword: "${keyword}"
- ${includeFAQ ? "Include a FAQ section at the end with 5 Q&A pairs (use h2 for FAQ and h3 for each question)." : ""}
- ${includeTOC ? "Start with a nav titled 'Table of contents' listing anchor links to each h2 section." : ""}
- ${instructions ? `Additional instructions: ${instructions}` : ""}

Return a JSON object with this exact structure:
{
  "title": "SEO-optimized article title (max 60 chars)",
  "title_ar": "Arabic version of title if language is Arabic or Both, else empty string",
  "slug": "url-friendly-slug-latin",
  "excerpt": "Compelling meta description (150-160 chars)",
  "content": "Full HTML article content with proper h2/h3 tags, paragraphs, lists",
  "content_ar": "Arabic HTML content if language is Arabic or Both, else empty string",
  "meta_title": "SEO meta title",
  "meta_description": "SEO meta description (150-160 chars)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"],
  "structured_data": { "@context": "https://schema.org", "@type": "Article" },
  "reading_time": 5,
  "seo_score": 85,
  "seo_notes": ["List of SEO improvements made"]
}`;

  try {
    const raw = await callGeminiJson({
      system: systemPrompt,
      user: userPrompt,
      maxOutputTokens: 8192,
    });
    const data = parseJsonLoose<Record<string, unknown>>(raw);
    res.json({ success: true, data });
  } catch (e) {
    req.log.error({ e }, "aiGenerate error");
    const message = e instanceof Error ? e.message : "Generation failed";
    res.status(500).json({ error: message });
  }
});

router.post("/ai/improve", adminAuth, async (req, res): Promise<void> => {
  const body = AiImproveContentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const { html, focusKeyword, instruction } = body.data;

  const system = `You refine HTML blog content for SEO and readability while staying AdSense-safe.
Return ONLY valid JSON with keys: "content" (improved full HTML), "seo_notes" (string array). No markdown.`;

  const user = `Improve this HTML article.

${focusKeyword ? `Focus keyword: ${focusKeyword}` : ""}
${instruction ? `Editor notes: ${instruction}` : ""}

HTML:
${html.slice(0, 120_000)}`;

  try {
    const raw = await callGeminiJson({
      system,
      user,
      maxOutputTokens: 8192,
    });
    const data = parseJsonLoose<{ content: string; seo_notes: string[] }>(raw);
    res.json({ success: true, data });
  } catch (e) {
    req.log.error({ e }, "aiImprove error");
    const message = e instanceof Error ? e.message : "Improve failed";
    res.status(500).json({ error: message });
  }
});

export default router;
