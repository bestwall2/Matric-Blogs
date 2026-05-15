import { NextRequest, NextResponse } from "next/server";

function extractVideoId(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("?")[0];
    return url.searchParams.get("v");
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
    return null;
  }
}

async function fetchTranscript(videoId: string): Promise<string> {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };

  // Step 1: fetch video page to get timedtext URL
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, { headers });
  const html = await pageRes.text();

  // Step 2: extract captions JSON from page
  const match = html.match(/"captions":\s*(\{.*?"captionTracks":\s*\[.*?\]\s*.*?\})/s);
  if (!match) {
    // Try to detect why - is it a valid video?
    if (html.includes('"playabilityStatus":{"status":"ERROR"')) throw new Error("video_not_found");
    if (html.includes('"playabilityStatus":{"status":"LOGIN_REQUIRED"')) throw new Error("login_required");
    throw new Error("no_captions");
  }

  let captionData: any;
  try {
    // Clean up the JSON - it's not always valid as extracted
    const cleaned = match[1].replace(/[\u0000-\u001F]/g, " ");
    captionData = JSON.parse(`{${cleaned.startsWith("{") ? cleaned.slice(1) : cleaned}`);
  } catch {
    // Try alternate extraction
    const tracksMatch = html.match(/"captionTracks":(\[.*?\])/s);
    if (!tracksMatch) throw new Error("no_captions");
    captionData = { captionTracks: JSON.parse(tracksMatch[1]) };
  }

  const tracks: any[] = captionData?.captionTracks || captionData?.playerCaptionsTracklistRenderer?.captionTracks || [];
  if (!tracks.length) throw new Error("no_captions");

  // Step 3: prefer Arabic track, fallback to English, then first available
  const track =
    tracks.find((t: any) => t.languageCode === "ar") ||
    tracks.find((t: any) => t.languageCode === "en") ||
    tracks.find((t: any) => !t.kind?.includes("asr") === false) || // auto-generated
    tracks[0];

  if (!track?.baseUrl) throw new Error("no_captions");

  // Step 4: fetch the actual transcript XML
  const transcriptRes = await fetch(track.baseUrl, { headers });
  const xml = await transcriptRes.text();

  // Step 5: parse XML to plain text
  const textMatches = xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g);
  const texts: string[] = [];
  for (const m of textMatches) {
    const decoded = m[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (decoded) texts.push(decoded);
  }

  const result = texts.join(" ").trim();
  if (!result) throw new Error("empty_transcript");
  return result;
}

export async function POST(req: NextRequest) {
  const { url, language, tone, instructions } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  if (!url) return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });

  const videoId = extractVideoId(url);
  if (!videoId) return NextResponse.json({ error: "رابط يوتيوب غير صالح" }, { status: 400 });

  let transcript: string;
  try {
    transcript = await fetchTranscript(videoId);
  } catch (e: any) {
    const msg = e?.message || "";
    if (msg === "no_captions") {
      return NextResponse.json({
        error: "هذا الفيديو لا يحتوي على ترجمة (Subtitles). جرّب فيديو آخر يحتوي على ترجمة يدوية أو تلقائية.",
      }, { status: 422 });
    }
    if (msg === "video_not_found") {
      return NextResponse.json({ error: "الفيديو غير موجود أو محذوف" }, { status: 404 });
    }
    if (msg === "login_required") {
      return NextResponse.json({ error: "هذا الفيديو خاص أو يتطلب تسجيل الدخول" }, { status: 403 });
    }
    return NextResponse.json({
      error: "فشل في جلب الترجمة من يوتيوب. تأكد أن الفيديو عام ويحتوي على ترجمة.",
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

  const geminiData = await geminiRes.json();
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
