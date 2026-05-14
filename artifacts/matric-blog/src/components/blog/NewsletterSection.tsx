'use client';

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribeNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate(
      { data: { email } },
      {
        onSuccess: (res) => {
          if (res.duplicate) {
            toast.info("أنت مشترك بالفعل في النشرة البريدية");
          } else {
            toast.success("تم الاشتراك بنجاح في النشرة البريدية");
          }
          setEmail("");
        },
        onError: () => {
          toast.error("فشل الاشتراك، يرجى المحاولة مجدداً");
        },
      }
    );
  };

  return (
    <section className="my-16 rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-l from-primary/20 via-primary/5 to-transparent pointer-events-none" />
      <div className="relative border border-primary/20 rounded-2xl p-8 md:p-12 bg-card/80 backdrop-blur-sm">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">اشترك في النشرة البريدية</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            احصل على أحدث المقالات والأخبار مباشرة في بريدك الإلكتروني
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto" data-testid="form-newsletter">
            <Input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-secondary border-border text-right"
              required
              data-testid="input-newsletter-email"
            />
            <Button
              type="submit"
              disabled={subscribe.isPending}
              data-testid="button-newsletter-submit"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {subscribe.isPending ? "..." : "اشترك"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
