import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { useGetFeaturedPosts, useListCategories } from "@workspace/api-client-react";
import type { Post } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ArticleCard from "@/components/blog/ArticleCard";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { formatDate, getReadingTime, cn } from "@/lib/utils";

export default function Home() {
  const { data: posts, isLoading } = useGetFeaturedPosts({ limit: 13 });
  const { data: categories } = useListCategories();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const allPosts = posts ?? [];
  const hero = allPosts[0];
  const secondary = allPosts.slice(1, 4);
  const remaining = activeCat
    ? allPosts.slice(1).filter((p) => p.categories?.slug === activeCat)
    : allPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="pt-20">
          {isLoading ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <Skeleton className="w-full h-96 rounded-2xl" />
            </div>
          ) : hero ? (
            <HeroPost post={hero} />
          ) : null}
        </section>

        {secondary.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {secondary.map((post) => (
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

          {categories && categories.length > 0 && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveCat(null)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeCat === null
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
                data-testid="filter-all"
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.slug === activeCat ? null : cat.slug)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    activeCat === cat.slug
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`filter-cat-${cat.slug}`}
                >
                  {cat.name_ar || cat.name}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : remaining.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {remaining.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">لا توجد مقالات في هذه الفئة</p>
          )}
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <NewsletterSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function HeroPost({ post }: { post: Post }) {
  const title = post.title_ar || post.title;
  const cat = post.categories;
  const readingTime = getReadingTime(post.content, post.reading_time);
  const words = title.split(" ");
  const firstWord = words[0];
  const restWords = words.slice(1).join(" ");

  return (
    <Link
      href={`/blog/${post.slug}`}
      data-testid={`hero-post-${post.id}`}
      className="block max-w-7xl mx-auto px-4 sm:px-6 group"
    >
      <div className="relative overflow-hidden rounded-2xl h-[480px] md:h-[520px] bg-secondary">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
