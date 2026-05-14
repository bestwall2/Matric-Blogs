import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript-plus";

function extractVideoId(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    return url.searchParams.get("v");
  } catch {
    // maybe it's already a plain ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { url, language, tone, instructions } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  if (!url) return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });

  const videoId = extractVideoId(url);
  if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

  // 1. Fetch transcript
  let transcript: string;
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    transcript = segments.map((s) => s.text).join(" ");
    if (!transcript.trim()) throw new Error("empty");
  } catch {
    return NextResponse.json({ error: "فشل في جلب النص من الفيديو. تأكد أن الفيديو يحتوي على ترجمة." }, { status: 422 });
  }

  // 2. Convert with Gemini
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

Return ONLY a valid JSON object (no markdown, no extra text) with these exact fields:
{
  "title": "English title",
  "title_ar": "Arabic title",
  "slug": "url-friendly-slug",
  "excerpt": "Short 2-sentence Arabic summary",
  "content": "Full HTML blog content in Arabic with proper h2, h3, p, ul tags",
  "meta_title": "SEO meta title (max 60 chars)",
  "meta_description": "SEO meta description (max 160 chars)",
  "meta_keywords": ["keyword1", "keyword2", "keyword3"],
  "reading_time": 5,
  "seo_score": 85,
  "seo_notes": ["note1", "note2"]
}
`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  const geminiData = await geminiRes.json();
  if (!geminiRes.ok) return NextResponse.json({ error: geminiData?.error?.message ?? "Gemini error" }, { status: 500 });

  const raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json({ post: parsed, transcriptLength: transcript.length });
  } catch {
    return NextResponse.json({ error: "Failed to parse Gemini response", raw }, { status: 500 });
  }
}
