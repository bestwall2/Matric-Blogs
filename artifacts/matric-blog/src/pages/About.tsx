import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { Rss, Target, Users, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Rss className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">من نحن</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            ماتريكبلوغ — موقعك الرائد في أخبار كرة القدم والبث المباشر والمحتوى التقني باللغة العربية
          </p>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Target, title: "مهمتنا", desc: "نقديم محتوى عربي أصيل وموثوق في مجال الرياضة والتقنية، مع التركيز على الجودة والدقة." },
              { icon: Users, title: "جمهورنا", desc: "نخدم ملايين القراء العرب من المغرب وشمال أفريقيا وسائر أنحاء الوطن العربي." },
              { icon: Globe, title: "رؤيتنا", desc: "أن نكون المنصة الأولى للمحتوى الرياضي والتقني باللغة العربية على الإنترنت." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-8 space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              تأسس ماتريكبلوغ بهدف تقديم محتوى رياضي وتقني باللغة العربية يلبي احتياجات الجمهور المغربي والعربي. نؤمن أن القارئ العربي يستحق محتوى عالي الجودة ومتخصصاً في مجاله.
            </p>
            <p>
              يضم فريقنا كتاباً ومحللين متخصصين في الرياضة والتقنية، يعملون بجد لتقديم أحدث الأخبار والتحليلات والمقالات التعليمية بأسلوب سهل وشيق.
            </p>
            <p>
              نغطي بطولة دوري أبطال أوروبا، كأس العالم، الدوريات الكبرى، وكل ما يهم عشاق الكرة. كما نقدم دليلاً شاملاً لمشاهدة المباريات عبر الإنترنت وأحدث أخبار التقنية.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
