import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) return NextResponse.json({ error: data?.error?.message ?? "Generation failed" }, { status: res.status });

  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) return NextResponse.json({ error: "No image returned" }, { status: 500 });

  return NextResponse.json({ image: `data:image/png;base64,${b64}` });
}
