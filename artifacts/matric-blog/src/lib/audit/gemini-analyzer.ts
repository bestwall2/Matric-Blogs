const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL = (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim().length > 0)
  ? process.env.GEMINI_MODEL.trim()
  : "gemini-2.5-flash";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function getKey(): string | null {
  const key = GEMINI_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

function buildPrompt(type: string, data: any): string {
  const prompts: Record<string, string> = {
    content: `أنت خبير في تحليل المحتوى العربي. حلل النص التالي من موقع إخباري/تقني عربي:

اقرأ النص جيداً وقيّم:

1. **AI_PROBABILITY** (رقم من 0-100): هل يبدو أن هذا النص كُتب بالذكاء الاصطناعي؟ ضع في اعتبارك:
   - وجود عبارات افتتاحية نمطية (مثل "في عصر السرعة الرقمية")
   - التكرار والقالبية في البنية
   - عدم وجود صوت شخصي أو تجارب ذاتية
   - أقسام FAQ المصطنعة
   - عمومية المعلومات وعدم وجود أمثلة محددة

2. **QUALITY_SCORE** (رقم من 0-100): جودة المحتوى من حيث:
   - العمق والتفاصيل
   - الفائدة العملية للقارئ
   - الأصالة والتفرد
   - سهولة القراءة

3. **WEAKNESSES** (قائمة مكونة من 3-5 نقاط): نقاط الضعف الرئيسية

4. **FIX_SUGGESTIONS** (قائمة مكونة من 3-5 نقاط): اقتراحات محددة للتحسين مع أمثلة عملية

5. **HUMAN_TOUCH** (نعم/لا): هل يوجد بصمة بشرية واضحة؟

أعد النتيجة بصيغة JSON فقط:
{
  "aiProbability": number,
  "qualityScore": number,
  "weaknesses": string[],
  "fixSuggestions": string[],
  "humanTouch": boolean,
  "summary": string
}

---

النص المراد تحليله:
"""
${(data.text || "").slice(0, 4000)}
"""`,
    site: `أنت خبير في مراجعة المواقع لطلب Google AdSense. حلل هذا الموقع العربي.

معلومات عن الموقع:
- URL: ${data.url || "غير معروف"}
- عدد المقالات: ${data.articleCount || 0}
- متوسط طول المقالات: ${data.avgWordCount || 0} كلمة
- هل توجد سياسة خصوصية: ${data.hasPrivacy ? "نعم" : "لا"}
- هل توجد شروط استخدام: ${data.hasTerms ? "نعم" : "لا"}
- هل توجد صفحة من نحن: ${data.hasAbout ? "نعم" : "لا"}
- هل توجد صفحة اتصال: ${data.hasContact ? "نعم" : "لا"}
- عدد المشاكل المكتشفة: ${data.issueCount || 0}
- المشاكل الحرجة: ${data.criticalCount || 0}

أعطني تقييماً دقيقاً كخبير AdSense:

1. **APPROVAL_PROBABILITY** (رقم من 0-100): احتمال قبول AdSense حالياً
2. **TOP_3_ISSUES** (3 نقاط): أهم 3 مشاكل تمنع القبول
3. **RECOMMENDATIONS** (3-5 نقاط): خطة عمل محددة خطوة بخطوة
4. **READINESS** (من 1-5): مدى جاهزية الموقع (1=غير جاهز أبداً، 5=جاهز تماماً)

أعد النتيجة بصيغة JSON فقط:
{
  "approvalProbability": number,
  "topIssues": string[],
  "recommendations": string[],
  "readiness": number,
  "verdict": string
}`,
    fix: `أنت مطور Next.js خبير. المستخدم يحتاج إلى إصلاح المشكلة التالية في موقعه:

المشكلة: ${data.issue}
الوصف: ${data.description}

قم بتوليد كود الإصلاح المناسب. أعد النتيجة بصيغة JSON فقط:
{
  "explanation": string,
  "code": string,
  "filePath": string,
  "steps": string[]
}`,
  };

  return prompts[type] || prompts.content;
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = getKey();
  if (!key) return null;

  try {
    const res = await fetch(
      `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
            topP: 0.8,
            topK: 40,
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.error("Gemini call failed:", err);
    return null;
  }
}

function extractJson(raw: string): any {
  try {
    // Try direct parse first
    return JSON.parse(raw);
  } catch {
    // Try extracting from markdown code block
    const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) {
      try { return JSON.parse(m[1]); } catch {}
    }
    // Try finding first { ... }
    const brace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (brace !== -1 && lastBrace > brace) {
      try { return JSON.parse(raw.slice(brace, lastBrace + 1)); } catch {}
    }
    return null;
  }
}

export async function analyzeContentWithGemini(text: string): Promise<{
  aiProbability: number;
  qualityScore: number;
  weaknesses: string[];
  fixSuggestions: string[];
  humanTouch: boolean;
  summary: string;
} | null> {
  const key = getKey();
  if (!key) return null;

  const raw = await callGemini(buildPrompt("content", { text }));
  if (!raw) return null;

  const result = extractJson(raw);
  if (!result) return null;

  return {
    aiProbability: result.aiProbability ?? 50,
    qualityScore: result.qualityScore ?? 50,
    weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
    fixSuggestions: Array.isArray(result.fixSuggestions) ? result.fixSuggestions : [],
    humanTouch: !!result.humanTouch,
    summary: result.summary || "",
  };
}

export async function analyzeSiteWithGemini(data: {
  url: string;
  articleCount: number;
  avgWordCount: number;
  hasPrivacy: boolean;
  hasTerms: boolean;
  hasAbout: boolean;
  hasContact: boolean;
  issueCount: number;
  criticalCount: number;
  pageTexts?: string[];
}): Promise<{
  approvalProbability: number;
  topIssues: string[];
  recommendations: string[];
  readiness: number;
  verdict: string;
} | null> {
  const key = getKey();
  if (!key) return null;

  const raw = await callGemini(buildPrompt("site", data));
  if (!raw) return null;

  const result = extractJson(raw);
  if (!result) return null;

  return {
    approvalProbability: result.approvalProbability ?? 5,
    topIssues: Array.isArray(result.topIssues) ? result.topIssues : [],
    recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    readiness: result.readiness ?? 1,
    verdict: result.verdict || "",
  };
}

export async function generateFixWithGemini(issue: string, description: string): Promise<{
  explanation: string;
  code: string;
  filePath: string;
  steps: string[];
} | null> {
  const key = getKey();
  if (!key) return null;

  const raw = await callGemini(buildPrompt("fix", { issue, description }));
  if (!raw) return null;

  const result = extractJson(raw);
  if (!result) return null;

  return {
    explanation: result.explanation || "",
    code: result.code || "",
    filePath: result.filePath || "",
    steps: Array.isArray(result.steps) ? result.steps : [],
  };
}

export function hasGeminiKey(): boolean {
  return getKey() !== null;
}
