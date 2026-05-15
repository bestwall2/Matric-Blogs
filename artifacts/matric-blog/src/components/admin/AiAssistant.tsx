'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X, Send, Loader2, MessageSquare, Lightbulb, Wrench, ChevronDown } from "lucide-react";

interface QuickAction {
  label: string;
  action: string;
  description: string;
}

interface AssistantResponse {
  message: string;
  suggestions: string[];
  quickActions: QuickAction[];
}

interface AiAssistantProps {
  page: string;
  context?: Record<string, any>;
}

export default function AiAssistant({ page, context }: AiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AssistantResponse | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [error, setError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (message?: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, context, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
      if (message) {
        setChatHistory(prev => [...prev, { role: "user", text: message }, { role: "ai", text: json.message }]);
      }
    } catch {
      setError(true);
      if (message) {
        setChatHistory(prev => [...prev, { role: "user", text: message }, { role: "ai", text: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." }]);
      }
    } finally {
      setLoading(false);
    }
  }, [page, context]);

  useEffect(() => {
    if (open && !data && !loading) {
      fetchSuggestions();
    }
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || loading) return;
    setChatHistory(prev => [...prev, { role: "user", text: chatMsg }]);
    fetchSuggestions(chatMsg);
    setChatMsg("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatHistory(prev => [...prev, { role: "user", text: suggestion }]);
    fetchSuggestions(suggestion);
  };

  const pageLabels: Record<string, string> = {
    dashboard: "لوحة التحكم",
    posts: "المقالات",
    categories: "الفئات",
    "ai-generate": "توليد بالذكاء",
    seo: "أدوات SEO",
    "youtube-to-blog": "يوتيوب → مقال",
    "post-editor": "محرر المقالات",
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xl shadow-red-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          data-testid="button-ai-assistant"
        >
          <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#080808] animate-pulse" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 left-5 z-50 w-80 sm:w-96 max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300" dir="rtl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-red-500/10 to-rose-600/5 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">المساعد الذكي</p>
                <p className="text-[10px] text-muted-foreground">{pageLabels[page] || page}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat & Suggestions */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
            {loading && !chatHistory.length ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">جاري تحليل الصفحة...</p>
              </div>
            ) : error && !data ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
                <p className="text-xs text-muted-foreground">تعذر الاتصال بالمساعد</p>
                <button
                  onClick={() => fetchSuggestions()}
                  className="text-xs text-primary hover:underline"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <>
                {chatHistory.length === 0 && data && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-secondary rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs text-foreground leading-relaxed">
                        {data.message}
                      </div>
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`text-xs leading-relaxed max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tl-sm"
                        : "bg-secondary text-foreground rounded-tr-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tr-sm px-3.5 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </>
            )}

            {/* Suggestions */}
            {data?.suggestions && data.suggestions.length > 0 && chatHistory.length === 0 && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  اقتراحات سريعة
                </p>
                {data.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-right text-xs text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-xl transition-colors border border-border/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            {data?.quickActions && data.quickActions.length > 0 && chatHistory.length === 0 && (
              <div className="pt-1 space-y-1.5">
                <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  إجراءات سريعة
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(qa.description)}
                      className="text-[11px] bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="shrink-0 border-t border-border p-3 flex items-center gap-2 bg-card/50">
            <input
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              placeholder="اسأل المساعد الذكي..."
              className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !chatMsg.trim()}
              className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center text-white transition-all shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
