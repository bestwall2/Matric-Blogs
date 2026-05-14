# Hugging Face Image Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Gemini image generation with Hugging Face Inference API for image generation, maintaining base64 output for frontend compatibility.

**Architecture:** Directly modify `src/app/api/generate-image/route.ts` to replace the Gemini fetch call with a POST request to Hugging Face's `black-forest-labs/FLUX.1-schnell` model.

**Tech Stack:** Next.js (App Router), standard `fetch`.

---

### Task 1: Update API Route to use Hugging Face

**Files:**
- Modify: `artifacts/matric-blog/src/app/api/generate-image/route.ts`

- [ ] **Step 1: Update API Route implementation**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.HF_TOKEN;

  if (!apiKey) return NextResponse.json({ error: "Missing HF_TOKEN" }, { status: 500 });
  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  try {
    const res = await fetch(
      "https://router.huggingface.co/nscale/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell",
          prompt: prompt,
          response_format: "b64_json",
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Hugging Face API error:", errorData);
      return NextResponse.json({ error: "Generation failed" }, { status: res.status });
    }

    const data = await res.json();
    const b64 = data.images[0].b64_json;
    
    return NextResponse.json({ image: `data:image/png;base64,${b64}` });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit changes**

```bash
git add artifacts/matric-blog/src/app/api/generate-image/route.ts
git commit -m "feat: replace gemini with hugging face for image generation"
```
