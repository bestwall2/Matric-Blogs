import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

const PROXY_URL = "https://youtrans.ahmed-dikha26.workers.dev/";

// Custom fetch that routes all youtube-transcript HTTP calls through Cloudflare Worker
const proxyFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body || null,
    }),
  });

  const data = await res.json() as any;

  // Return a Response-compatible object for the library
  const bodyText = typeof data.body === "string" ? data.body : JSON.stringify(data.body);
  return new Response(bodyText, {
    status: data.status ?? 200,
    headers: { "Content-Type": data.contentType ?? "text/plain" },
  });
};

export async function POST(req: NextRequest) {
  const { url, language, tone, instructions } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  if (!url) return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });

  // Fetch transcript via youtube-transcript library routed through CF Worker proxy
  let transcript: string;
  try {
    const segments = await YoutubeTranscript.fetchTranscript(url, {
      fetch: proxyFetch as any,
    });

    if (!segments?.length) throw new Error("empty");

    transcript = segments.map((s) => s.text).join(" ").trim();
  } catch (e: any) {
    const msg = e?.message || "";

    if (msg.includes("disabled") || msg.includes("No transcripts")) {
      return NextResponse.json({
        error: "هذا الفيديو لا يحتوي على ترجمة (Subtitles). جرّب فيديو آخر يحتوي على ترجمة يدوية أو تلقائية.",
      }, { status: 422 });
    }
    if (msg.includes("unavailable") || msg.includes("no longer available")) {
      return NextResponse.json({ error: "الفيديو غير موجود أو محذوف" }, { status: 404 });
    }
    if (msg.includes("too many requests") || msg.includes("captcha")) {
      return NextResponse.json({ error: "يوتيوب يمنع الطلبات مؤقتاً، جرب بعد قليل" }, { status: 429 });
    }
    return NextResponse.json({
      error: "فشل في جلب الترجمة من يوتيوب. تأكد أن الفيديو عام ويحتوي على ترجمة (CC).",
    }, { status: 422 });
  }

  const prompt = `
You are an expert Arabic blog writer and content strategist.

Convert the following YouTube video transcript into a high-quality, SEO-optimized blog article.

Transcript:
"""
${transcript.slice(0, 12000)}
"""

Instructions:
- Language: ${language || "Arabic"}
- Tone: ${tone || "Educational"}
- ${instructions ? `Extra instructions: ${instructions}` : ""}

Write with a HUMAN voice. Use natural Arabic, not formal robot-speak.
Never start with cliché openers like "في عصر السرعة الرقمية".

Return ONLY a valid JSON object (no markdown, no extra text) with:
{
  "title": "English title",
  "title_ar": "Arabic title",
  "slug": "url-friendly-slug",
  "excerpt": "Short 2-sentence Arabic summary",
  "content": "Full HTML blog content in Arabic with h2, h3, p, ul tags",
  "meta_title": "SEO meta title max 60 chars",
  "meta_description": "SEO meta description max 160 chars",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"],
  "reading_time": 5,
  "seo_score": 85,
  "seo_notes": ["note1", "note2"]
}
`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  const geminiData = await geminiRes.json() as any;
  if (!geminiRes.ok) {
    return NextResponse.json({ error: geminiData?.error?.message ?? "Gemini error" }, { status: 500 });
  }

  const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json({ post: parsed, transcriptLength: transcript.length });
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response", raw }, { status: 500 });
  }
}
