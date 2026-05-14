import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "المدونة — ماتريكبلوغ",
  description: "اكتشف أحدث مقالات كرة القدم والتقنية والبث المباشر باللغة العربية. محتوى متخصص لجمهور المغرب والوطن العربي.",
  openGraph: { title: "المدونة — ماتريكبلوغ", description: "مقالات متخصصة في كرة القدم والتقنية والبث المباشر.", type: "website" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://matric-blogs-26.vercel.app";

async function getInitialPosts() {
  try {
    const res = await fetch(`${SITE_URL}/api/posts?pageSize=12&page=1`, { next: { revalidate: 300 } });
    if (!res.ok) return { posts: [], total: 0 };
    return res.json();
  } catch { return { posts: [], total: 0 }; }
}

async function getInitialCategories() {
  try {
    const res = await fetch(`${SITE_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function Blog() {
  const [initialData, initialCategories] = await Promise.all([getInitialPosts(), getInitialCategories()]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Suspense fallback={<div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>}>
          <BlogContent initialData={initialData} initialCategories={initialCategories} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
