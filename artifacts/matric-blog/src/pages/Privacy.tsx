import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-3xl font-black text-foreground mb-6">سياسة الخصوصية</h1>
        <div className="rounded-xl border border-border bg-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">جمع المعلومات</h2>
            <p>نجمع المعلومات التي تقدمها لنا طوعاً عند الاشتراك في النشرة البريدية أو التواصل معنا. لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">ملفات تعريف الارتباط</h2>
            <p>نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم وتحليل حركة الزيارات على الموقع. يمكنك تعطيل هذه الملفات من إعدادات متصفحك.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">الإعلانات</h2>
            <p>نستخدم Google AdSense لعرض الإعلانات. قد يستخدم Google ملفات تعريف الارتباط لعرض إعلانات ذات صلة بناءً على زياراتك السابقة لهذا الموقع ومواقع أخرى.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-foreground mb-2">حقوق المستخدم</h2>
            <p>لديك الحق في الوصول إلى بياناتك الشخصية وتعديلها أو حذفها. للتواصل معنا بشأن بياناتك، يرجى مراسلتنا عبر البريد الإلكتروني.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
