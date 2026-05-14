import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { Mail, Twitter, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-foreground mb-3">تواصل معنا</h1>
          <p className="text-muted-foreground text-sm">يسعدنا التواصل معك ومعرفة آرائك واقتراحاتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Mail, title: "البريد الإلكتروني", val: "contact@matricblog.com", href: "mailto:contact@matricblog.com" },
            { icon: Twitter, title: "تويتر / X", val: "@MatricBlog", href: "https://twitter.com/MatricBlog" },
            { icon: MessageSquare, title: "واتساب للأعمال", val: "+212 600 000000", href: "https://wa.me/212600000000" },
          ].map(({ icon: Icon, title, val, href }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors group text-center"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{val}</p>
            </a>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>نرحب بجميع استفساراتكم، سواء كانت تتعلق بالشراكات الإعلانية أو التعاون في المحتوى أو أي اقتراحات أخرى.</p>
          <p>نحرص على الرد على جميع الرسائل في أقرب وقت ممكن، عادةً خلال 24-48 ساعة من تاريخ الإرسال.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
