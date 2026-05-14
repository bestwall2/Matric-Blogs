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

  const wordCounts = { short: 500, medium: 1000, long: 2000 } as const;
  const wordCount = wordCounts[length as keyof typeof wordCounts];

  const systemPrompt = `You are an expert blog writer and SEO specialist. You write high-quality,
Google AdSense-approved content that passes AI detection tools. CRITICAL RULES:
- Write with a HUMAN VOICE: use first-person, personal experience, specific examples
- NEVER use generic AI filler phrases: avoid "في عصر السرعة الرقمية", "لا شك أن", "يتجه العالم", "في عصرنا الرقمي"
- Write like a real person sharing their actual experience and knowledge
- Include concrete numbers, data, and real examples
- Use natural conversational Arabic (not formal MSA robot-speak)
- Each paragraph must add unique value — no fluff or padding
- Avoid FAQ sections unless absolutely necessary (they look like AI)
- Well-structured with proper H2/H3 headings
- SEO-optimized with natural keyword usage (not keyword stuffing)
- Free of any content that violates Google policies
- Written in a ${tone} tone
You return ONLY valid JSON, no markdown fences, no preamble.`;

  const userPrompt = `Write a complete blog article about: "${topic}"

Requirements:
- Language: ${language}
- Article type: ${type}
- Target word count: approximately ${wordCount} words
- Focus keyword: "${keyword}"
- ${includeFAQ ? "" : "DO NOT include a FAQ section — it looks like AI-generated content."}
- ${includeFAQ ? "Include a FAQ section at the end with 3-5 natural Q&A pairs (use h2 for FAQ and h3 for each question). Make questions feel real, not obvious." : ""}
- ${includeTOC ? "Start with a 'Table of Contents' nav listing anchor links to each h2 section." : ""}
- ${instructions ? `Additional instructions: ${instructions}` : ""}

CRITICAL HUMANIZATION RULES (ignore at your own risk):
1. ADD personal experience: use phrases like "في تجربتي", "استخدمت هذا لمدة أسبوع", "جربت الطريقتين"
2. ADD real numbers: "حصلت على 1500 مشاهدة", "وفرت 3 ساعات يومياً", "دفعت 200 درهم فقط"
3. Use natural conversational tone — NOT formal academic Arabic
4. AVOID these exact phrases: "في عصر السرعة الرقمية", "لا شك أن", "يتجه العالم نحو", "في عصرنا الرقمي", "من المهم أن", "تجدر الإشارة"
5. ADD specific examples of real tools, prices, results, and personal outcomes
6. Keep paragraphs short (2-4 sentences max per paragraph)
7. Start with a hook that feels like a human talking, not an encyclopedia

Return a JSON object with this exact structure:
{
  "title": "SEO-optimized article title (max 60 chars)",
  "title_ar": "Arabic version of title if language is Arabic or Both, else empty string",
  "slug": "url-friendly-slug-latin",
  "excerpt": "Compelling meta description (150-160 chars) — must sound like a human wrote it",
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
    req.log.error({ err: e }, "aiGenerate error details");
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
