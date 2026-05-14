import type { Metadata } from "next";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — ماتريكبلوغ",
  description: "سياسة الخصوصية لموقع ماتريكبلوغ، تشمل استخدام Google AdSense وملفات تعريف الارتباط وجمع البيانات.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <h1 className="text-3xl font-black text-foreground mb-2">سياسة الخصوصية</h1>
        <p className="text-xs text-muted-foreground mb-8">آخر تحديث: مايو 2026</p>
        <div className="rounded-xl border border-border bg-card p-8 space-y-8 text-sm text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">1. مقدمة</h2>
            <p>يوفر موقع <strong className="text-foreground">ماتريكبلوغ</strong> (matric-blogs-26.vercel.app) هذه السياسة لإعلامك بكيفية جمع بياناتك واستخدامها وحمايتها. باستخدام الموقع فأنت توافق على هذه السياسة.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">2. المعلومات التي نجمعها</h2>
            <p>نجمع المعلومات التي تقدمها طوعاً (مثل البريد الإلكتروني عند التواصل معنا) وبيانات الاستخدام التلقائية مثل عنوان IP ونوع المتصفح والصفحات المزارة عبر ملفات تعريف الارتباط وأدوات التحليل.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">3. إعلانات Google AdSense</h2>
            <p className="mb-2">يستخدم هذا الموقع <strong className="text-foreground">Google AdSense</strong> لعرض الإعلانات. تستخدم Google ملفات تعريف الارتباط، بما في ذلك ملف <strong className="text-foreground">DoubleClick cookie</strong>، لعرض إعلانات مخصصة بناءً على زياراتك السابقة لهذا الموقع ومواقع أخرى على الإنترنت.</p>
            <ul className="list-disc list-inside space-y-1 mr-3">
              <li>قد تستخدم Google وشركاؤها في الإعلانات ملفات تعريف ارتباط لعرض الإعلانات استناداً إلى زياراتك السابقة.</li>
              <li>يمكنك إلغاء الاشتراك في الإعلانات المخصصة عبر: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">إعدادات الإعلانات</a>.</li>
              <li>للمزيد حول كيفية استخدام Google للبيانات، راجع: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">سياسة خصوصية Google</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">4. Google Analytics</h2>
            <p>نستخدم Google Analytics لتحليل حركة الزيارات وتحسين تجربة المستخدم. تجمع هذه الخدمة بيانات مجهولة الهوية مثل عدد الزيارات ومدتها والصفحات الأكثر زيارة. يمكنك إلغاء تتبع Analytics عبر <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">إضافة المتصفح</a> الخاصة بذلك.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">5. ملفات تعريف الارتباط (Cookies)</h2>
            <p>نستخدم ملفات تعريف الارتباط لأغراض وظيفية وتحليلية وإعلانية. يمكنك التحكم في هذه الملفات عبر إعدادات متصفحك، لكن تعطيلها قد يؤثر على بعض وظائف الموقع.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">6. مشاركة البيانات</h2>
            <p>لا نبيع بياناتك الشخصية لأطراف ثالثة. نشارك البيانات فقط مع مزودي الخدمات (مثل Google) بالقدر اللازم لتشغيل الموقع.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">7. حقوقك</h2>
            <p>لديك الحق في الوصول إلى بياناتك وتعديلها أو حذفها. للتواصل بشأن بياناتك الشخصية، راسلنا على: <a href="mailto:contact@matricblog.com" className="text-primary hover:underline">contact@matricblog.com</a></p>
          </section>

          <section>
            <h2 className="text-base font-bold text-foreground mb-2">8. التعديلات</h2>
            <p>قد نعدّل هذه السياسة في أي وقت. سيتم الإشارة إلى تاريخ آخر تحديث في أعلى الصفحة. استمرارك في استخدام الموقع بعد التعديل يعني موافقتك عليه.</p>
          </section>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
