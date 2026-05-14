import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { formatDate, getReadingTime } from "@/lib/utils";
import HomeFilteredPosts from "./HomeFilteredPosts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://matric-blogs-26.vercel.app";

export const metadata: Metadata = {
  title: "ماتريكبلوغ — أخبار كرة القدم والتقنية",
  description: "ماتريكبلوغ — موقعك المتخصص في أخبار كرة القدم والبث المباشر والتقنية باللغة العربية.",
  openGraph: {
    title: "ماتريكبلوغ",
    description: "ماتريكبلوغ — موقعك المتخصص في أخبار كرة القدم والبث المباشر والتقنية.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ماتريكبلوغ",
    description: "ماتريكبلوغ — أخبار كرة القدم والتقنية.",
  },
};

async function getFeaturedPosts() {
  try {
    const res = await fetch(`${SITE_URL}/api/posts/featured?limit=13`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${SITE_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function Home() {
  const [allPosts, categories] = await Promise.all([getFeaturedPosts(), getCategories()]);

  const hero = allPosts?.[0];
  const secondary = allPosts?.slice(1, 4) ?? [];
  const remaining = allPosts?.slice(1) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {hero && (
          <section className="pt-20">
            <HeroPost post={hero} />
          </section>
        )}

        {secondary.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {secondary.map((post: any) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground">أحدث المقالات</h2>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 gap-1">
                عرض الكل <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <HomeFilteredPosts posts={remaining} categories={categories ?? []} />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <NewsletterSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroPost({ post }: { post: any }) {
  const title = post.title_ar || post.title;
  const cat = post.categories;
  const readingTime = getReadingTime(post.content, post.reading_time);
  const words = title.split(" ");
  const firstWord = words[0];
  const restWords = words.slice(1).join(" ");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block max-w-7xl mx-auto px-4 sm:px-6 group"
    >
      <div className="relative overflow-hidden rounded-2xl h-[480px] md:h-[520px] bg-secondary">
          {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10">
          {cat && (
            <Badge
              className="mb-3 text-xs font-bold px-2.5 py-1"
              style={{ backgroundColor: cat.color || "#e63946", color: "white" }}
            >
              {cat.name_ar || cat.name}
            </Badge>
          )}
          <h1 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight text-balance">
            <span className="text-primary">{firstWord}</span>
            {restWords ? ` ${restWords}` : ""}
          </h1>
          {post.excerpt && (
            <p className="text-white/70 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-white/60 text-xs">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime} دقيقة</span>
            {(post.view_count ?? 0) > 0 && (
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(post.view_count ?? 0).toLocaleString("ar")}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
