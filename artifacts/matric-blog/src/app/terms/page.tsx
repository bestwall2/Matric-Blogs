import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-3xl font-black text-foreground mb-6">شروط الاستخدام</h1>
        <div className="rounded-xl border border-border bg-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">القبول بالشروط</h2>
            <p>باستخدامك لموقع ماتريكبلوغ، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق عليها، يرجى عدم استخدام الموقع.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">حقوق الملكية الفكرية</h2>
            <p>جميع المحتويات المنشورة على الموقع، بما في ذلك المقالات والصور والتصاميم، هي ملك حصري لماتريكبلوغ ومحمية بموجب قوانين حقوق الملكية الفكرية.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">استخدام المحتوى</h2>
            <p>يُسمح بنسب المحتوى ومشاركته مع الإشارة إلى المصدر. يُحظر نسخ المحتوى بالكامل أو إعادة نشره بدون إذن كتابي مسبق.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">إخلاء المسؤولية</h2>
            <p>المحتوى المقدم في الموقع للأغراض الإعلامية فقط. لا نتحمل أي مسؤولية عن القرارات التي تتخذها بناءً على المعلومات الواردة في الموقع.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
