import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

const PAGE_PROMPTS: Record<string, string> = {
  dashboard: `أنت مساعد ذكي ومفيد لمدير موقع ماتريكبلوغ. المستخدم موجود في صفحة لوحة التحكم (Dashboard).
    
المعلومات المتاحة:
- إحصائيات الموقع (عدد المقالات، الفئات، المشاهدات)
- آخر المقالات المنشورة

مهمتك:
1. قدّم نصائح ذكية لتحسين الموقع
2. اقترح أفكار لمقالات جديدة بناءً على الوضع الحالي
3. حلل الأداء واقترح تحسينات
4. كن ودوداً وكأنك صديق يساعد

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ترحيبية ودودة من 1-2 جمل",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف قصير" }
  ]
}`,

  posts: `أنت مساعد ذكي لمدير موقع ماتريكبلوغ. المستخدم في صفحة إدارة المقالات (Posts).

المعلومات المتاحة:
- قائمة المقالات مع حالاتها (منشور، مسودة، مجدول)

مهمتك:
1. اقترح تحسينات للمقالات الموجودة
2. نصائح لتنظيم المقالات وحذف المهمل
3. اقتراحات لمقالات جديدة بناءً على الفجوات
4. نصائح SEO عامة

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,

  categories: `أنت مساعد ذكي لمدير موقع ماتريكبلوغ. المستخدم في صفحة إدارة الفئات (Categories).

مهمتك:
1. اقترح تصنيفات مقترحة لمدونة تقنية/إخبارية عربية
2. نصائح لتحسين هيكل التصنيفات
3. أفكار لتنظيم المحتوى بالفئات

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,

  "ai-generate": `أنت مساعد ذكي ومبدع. المستخدم يستخدم أداة توليد المقالات بالذكاء الاصطناعي.

مهمتك:
1. اقترح مواضيع حصرية ومثيرة لمدونة تقنية عربية
2. نصائح لتحسين جودة المقالات المُولَّدة
3. أفكار لكلمات مفتاحية قوية
4. اقتراحات لتحسين البرومبت (prompt)

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة تحفيزية ودودة",
  "suggestions": ["اقتراح موضوع 1", "اقتراح موضوع 2", "اقتراح موضوع 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,

  seo: `أنت خبير SEO ومساعد ذكي. المستخدم في صفحة أدوات SEO وتحليل AdSense.

مهمتك:
1. حلل المشاكل الموجودة واقترح حلولاً عملية
2. نصائح لتحسين ترتيب الموقع
3. إرشادات لاجتياز فحص AdSense
4. اقترح تحسينات تقنية للموقع

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["نصيحة SEO 1", "نصيحة SEO 2", "نصيحة SEO 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "fix", "description": "وصف" }
  ]
}`,

  "youtube-to-blog": `أنت مساعد ذكي. المستخدم يحول فيديوهات يوتيوب إلى مقالات.

مهمتك:
1. اقترح قنوات يوتيوب تقنية عربية مفيدة للتحويل
2. نصائح لتحسين جودة المقالات المُستخرجة
3. أفكار لاستغلال الفيديوهات القديمة
4. نصائح لكتابة تعليمات إضافية فعالة

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["اقتراح 1", "اقتراح 2", "اقتراح 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,

  "post-editor": `أنت مساعد ذكي لكتابة المحتوى. المستخدم في محرر المقالات.

مهمتك:
1. نصائح لتحسين جودة الكتابة
2. اقتراحات لتحسين SEO المقال
3. تذكير بأفضل الممارسات
4. اقتراح تحسينات على المحتوى

أعد النتيجة بصيغة JSON فقط:
{
  "message": "رسالة ودودة",
  "suggestions": ["نصيحة 1", "نصيحة 2", "نصيحة 3"],
  "quickActions": [
    { "label": "نص الزر", "action": "suggest", "description": "وصف" }
  ]
}`,
};

function getPrompt(page: string, context: any, message?: string): string {
  const basePrompt = PAGE_PROMPTS[page] || PAGE_PROMPTS.dashboard;

  let contextStr = "";
  if (context) {
    contextStr = `\n\nمعلومات إضافية عن الوضع الحالي:\n${JSON.stringify(context, null, 2)}`;
  }

  if (message) {
    return `${basePrompt}${contextStr}\n\nسؤال المستخدم: "${message}"\n\nأجب على سؤال المستخدم بشكل مباشر ومفيد.`;
  }

  return `${basePrompt}${contextStr}`;
}

async function callGemini(prompt: string): Promise<string | null> {
  const key = GEMINI_API_KEY?.trim();
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
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40,
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

function extractJson(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) {
      try { return JSON.parse(m[1].trim()); } catch {}
    }
    const brace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (brace !== -1 && lastBrace > brace) {
      try { return JSON.parse(raw.slice(brace, lastBrace + 1)); } catch {}
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  const key = GEMINI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "مفتاح Gemini غير مضبوط" }, { status: 500 });
  }

  try {
    const { page, context, message } = await req.json();
    const pageKey = (page || "dashboard").replace(/^\//, "");
    const prompt = getPrompt(pageKey, context, message);

    const raw = await callGemini(prompt);
    if (!raw) {
      return NextResponse.json({
        message: "أهلاً بك! 👋 أنا مساعدك الذكي. اسألني عن أي شيء أو اختر من الاقتراحات أدناه.",
        suggestions: [
          "كيف يمكنني تحسين أداء الموقع؟",
          "أقترح عليك مواضيع جديدة",
          "ساعدني في تحسين SEO"
        ],
        quickActions: [],
      });
    }

    const parsed = extractJson(raw);
    if (!parsed) {
      return NextResponse.json({
        message: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
        suggestions: [
          "أعطني نصائح لتحسين المحتوى",
          "اقترح أدوات جديدة",
          "كيف أحسن ترتيب الموقع"
        ],
        quickActions: [],
      });
    }

    return NextResponse.json({
      message: parsed.message || "مرحباً!",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      quickActions: Array.isArray(parsed.quickActions) ? parsed.quickActions : [],
    });
  } catch {
    return NextResponse.json({
      message: "عذراً، حدث خطأ. حاول مرة أخرى.",
      suggestions: [],
      quickActions: [],
    });
  }
}
