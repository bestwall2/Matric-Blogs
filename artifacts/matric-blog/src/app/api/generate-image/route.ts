import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Image generation API error:", data);
    return NextResponse.json({ error: data?.error?.message ?? "Generation failed" }, { status: res.status });
  }

  const parts = data?.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData);

  if (!imagePart) {
    console.error("No image part found in Gemini response:", data);
    return NextResponse.json({ error: "No image returned" }, { status: 500 });
  }

  const { data: b64, mimeType } = imagePart.inlineData;
  return NextResponse.json({ image: `data:${mimeType};base64,${b64}` });
}
