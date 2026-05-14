import { NextRequest, NextResponse } from "next/server";
import { analyzeSite } from "@/lib/audit/analyzer";
import {
  analyzeContentWithGemini,
  analyzeSiteWithGemini,
  hasGeminiKey,
} from "@/lib/audit/gemini-analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'url' in request body" }, { status: 400 });
    }

    // 1. Run rule-based analysis (always)
    const result = await analyzeSite(url);
    const geminiAvailable = hasGeminiKey();

    // 2. If Gemini is available, enhance with AI analysis
    let geminiAnalysis = null;
    if (geminiAvailable) {
      try {
        // Collect page texts for Gemini to analyze
        const pageTexts: string[] = [];
        for (const page of result.pages) {
          try {
            const res = await fetch(page.url, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
              const html = await res.text();
              // Strip HTML tags
              const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
              pageTexts.push(text.slice(0, 2000));
            }
          } catch {}
        }

        // Run Gemini analyses in parallel
        const [siteAi, ...contentAiResults] = await Promise.all([
          analyzeSiteWithGemini({
            url,
            articleCount: result.content.articleCount,
            avgWordCount: result.content.avgWordCount,
            hasPrivacy: result.trust.hasPrivacyPolicy,
            hasTerms: result.trust.hasTermsOfService,
            hasAbout: result.trust.hasAboutPage,
            hasContact: result.trust.hasContactPage,
            issueCount: result.summary.totalIssues,
            criticalCount: result.summary.criticalIssues,
            pageTexts,
          }),
          ...result.pages.filter(p => p.url.includes("/blog/")).map(p =>
            fetch(p.url, { signal: AbortSignal.timeout(5000) })
              .then(r => r.ok ? r.text() : "")
              .then(html => {
                const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
                return analyzeContentWithGemini(text);
              })
              .catch(() => null)
          ),
        ]);

        geminiAnalysis = {
          site: siteAi,
          articles: contentAiResults.filter(Boolean),
        };

        // Merge Gemini's approval probability if available (more accurate)
        if (siteAi?.approvalProbability !== undefined) {
          result.summary.approvalProbability = Math.round(
            (result.summary.approvalProbability + siteAi.approvalProbability) / 2
          );
        }

        // Add Gemini verdict to AI signals
        if (siteAi?.topIssues?.length) {
          result.content.aiSignals.push(
            `[AI Analysis] ${siteAi.topIssues[0]}`
          );
          if (siteAi.topIssues[1]) {
            result.content.aiSignals.push(`[AI Analysis] ${siteAi.topIssues[1]}`);
          }
        }

        // Merge content analysis from Gemini
        for (let i = 0; i < contentAiResults.length; i++) {
          const ai = contentAiResults[i];
          if (ai) {
            result.content.aiProbability = Math.round(
              (result.content.aiProbability + ai.aiProbability) / 2
            );
            if (ai.aiProbability > 50) {
              result.content.aiSignals.push(
                `[Gemini] AI probability: ${ai.aiProbability}% — ${ai.summary}`
              );
            }
            if (ai.fixSuggestions?.length) {
              // Add as issues
              result.content.issues.push({
                type: ai.qualityScore < 40 ? "critical" : "high",
                category: "content",
                message: `[Gemini] ${ai.fixSuggestions[0]}`,
                detail: ai.summary || "",
                suggestion: ai.fixSuggestions.slice(1).join(" | "),
              });
            }
          }
        }
      } catch (err) {
        console.error("Gemini enhancement failed (non-fatal):", err);
        geminiAnalysis = { error: "Gemini analysis failed but rule-based results are available" };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        _engine: geminiAvailable ? "gemini-enhanced" : "rule-based",
        _gemini: geminiAnalysis,
      },
    }, { status: 200 });
  } catch (err: any) {
    console.error("Audit analysis error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
