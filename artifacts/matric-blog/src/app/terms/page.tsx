import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "شروط الاستخدام — ماتريكبلوغ",
  description: "شروط استخدام موقع ماتريكبلوغ. تعرف على حقوقك وواجباتك عند استخدام الموقع.",
  openGraph: {
    title: "شروط الاستخدام — ماتريكبلوغ",
    description: "شروط استخدام موقع ماتريكبلوغ.",
    type: "website",
  },
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-3xl font-black text-foreground mb-2">شروط الاستخدام</h1>
        <p className="text-xs text-muted-foreground mb-8">آخر تحديث: مايو 2026</p>
        <div className="rounded-xl border border-border bg-card p-8 space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">1. القبول بالشروط</h2>
            <p>باستخدامك لموقع ماتريكبلوغ، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق عليها، يرجى عدم استخدام الموقع. يحق لإدارة الموقع تعديل هذه الشروط في أي وقت، ويعتبر استمرارك في استخدام الموقع بعد التعديل موافقة ضمنية على الشروط المعدلة.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">2. حقوق الملكية الفكرية</h2>
            <p>جميع المحتويات المنشورة على الموقع، بما في ذلك المقالات والصور والتصاميم والشعارات، هي ملك حصري لماتريكبلوغ ومحمية بموجب قوانين حقوق الملكية الفكرية. لا يجوز نسخ أو توزيع أو تعديل أو إعادة نشر أي محتوى من الموقع دون الحصول على إذن كتابي مسبق من الإدارة.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">3. استخدام المحتوى</h2>
            <p>يُسمح بمشاركة روابط المقالات والمقتطفات القصيرة مع الإشارة إلى المصدر. يُحظر نسخ المحتوى بالكامل أو إعادة نشره بدون إذن كتابي مسبق. في حالة الترخيص بإعادة النشر، يجب الإشارة بوضوح إلى المصدر مع رابط مباشر للمقال الأصلي.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">4. إخلاء المسؤولية</h2>
            <p>المحتوى المقدم في الموقع للأغراض الإعلامية فقط. نبذل قصارى جهدنا لضمان دقة المعلومات، لكننا لا نضمن اكتمالها أو تحديثها في جميع الأوقات. لا نتحمل أي مسؤولية عن القرارات التي تتخذها بناءً على المعلومات الواردة في الموقع، ولا عن أي أضرار مباشرة أو غير مباشرة قد تنشأ عن استخدام الموقع.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">5. الروابط الخارجية</h2>
            <p>قد يحتوي الموقع على روابط لمواقع خارجية لا تخضع لسيطرتنا. لا نتحمل أي مسؤولية عن محتوى أو ممارسات الخصوصية في تلك المواقع. إدراج هذه الروابط لا يعني تأييداً أو توصية من جانبنا.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">6. القانون الواجب التطبيق</h2>
            <p>تخضع هذه الشروط وتُفسر وفقاً للقوانين المغربية. في حالة نشوء أي نزاع يتعلق بهذه الشروط، يتم حله وديّاً أولاً، وفي حال تعذر ذلك، يُرفع النزاع إلى المحاكم المختصة في المملكة المغربية.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">7. تعديل الشروط</h2>
            <p>تحتفظ إدارة الموقع بحق تعديل هذه الشروط في أي وقت دون إشعار مسبق. سيتم الإشارة إلى تاريخ آخر تحديث في أعلى الصفحة. يُنصح المستخدمون بمراجعة هذه الصفحة بشكل دوري للاطلاع على أي تغييرات.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">8. التواصل معنا</h2>
            <p>للاستفسارات المتعلقة بهذه الشروط أو للإبلاغ عن أي انتهاك، يرجى التواصل معنا عبر: <a href="mailto:contact@matricblog.com" className="text-primary hover:underline">contact@matricblog.com</a> أو عبر صفحة <a href="/contact" className="text-primary hover:underline">تواصل معنا</a>.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
