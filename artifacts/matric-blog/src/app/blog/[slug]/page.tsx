'use client';

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, Eye, Calendar, Share2, Twitter, Facebook, Link as LinkIcon, ChevronUp, ArrowRight } from "lucide-react";
import { useGetPostBySlug, getGetPostBySlugQueryKey, useIncrementPostView, useListPosts, getListPostsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ArticleCard from "@/components/blog/ArticleCard";
import { formatDate, getReadingTime, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Article() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data: post, isLoading, error } = useGetPostBySlug(slug, {
    query: { enabled: !!slug, queryKey: getGetPostBySlugQueryKey(slug) },
  });
  const incrementView = useIncrementPostView();
  const [progress, setProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const { data: related } = useListPosts(
    { pageSize: 3 },
    { query: { enabled: !!post, queryKey: getListPostsQueryKey({ pageSize: 3 }) } }
  );

  useEffect(() => {
    if (slug) {
      incrementView.mutate({ data: { slug } });
    }
  }, [slug]);

  useEffect(() => {
    const handler = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.1);
      setProgress(Math.min(100, (scrolled / total) * 100));
      setShowBackTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleShare = (type: "twitter" | "facebook" | "copy") => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = post?.title_ar || post?.title || "";
    if (type === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
    else if (type === "facebook") window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    else { navigator.clipboard.writeText(url); toast.success("تم نسخ الرابط"); }
  };

  if (isLoading) return <ArticleSkeleton />;
  if (error || !post) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground mb-2">المقال غير موجود</p>
        <Link href="/blog"><Button variant="outline">العودة للمدونة</Button></Link>
      </div>
    </div>
  );

  const title = post.title_ar || post.title;
  const content = post.content_ar || post.content;
  const readingTime = getReadingTime(content, post.reading_time);
  const cat = post.categories;

  const headings = extractHeadings(content);

  const relatedPosts = (related?.posts ?? []).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-primary transition-all duration-150"
        style={{ width: `${progress}%` }}
        data-testid="reading-progress"
      />
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="w-4 h-4" />
            العودة إلى المدونة
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article ref={articleRef} className="lg:col-span-3">
            {cat && (
              <Link href={`/category/${cat.slug}`} className="inline-block mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: cat.color || "#e63946" }}
                >
                  {cat.name_ar || cat.name}
                </span>
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl font-black text-foreground mb-4 leading-tight">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.published_at || post.created_at)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime} دقيقة للقراءة</span>
              {(post.view_count ?? 0) > 0 && (
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(post.view_count ?? 0).toLocaleString("ar")} مشاهدة</span>
              )}
            </div>

            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={title}
                className="w-full h-64 md:h-80 object-cover rounded-xl mb-8"
              />
            )}

            <div
              className="article-html leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
              data-testid="article-content"
            />

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Share2 className="w-4 h-4" /> مشاركة:
                </span>
                <Button size="sm" variant="outline" onClick={() => handleShare("twitter")} className="gap-1 border-border" data-testid="button-share-twitter">
                  <Twitter className="w-3.5 h-3.5" /> X
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare("facebook")} className="gap-1 border-border" data-testid="button-share-facebook">
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare("copy")} className="gap-1 border-border" data-testid="button-share-copy">
                  <LinkIcon className="w-3.5 h-3.5" /> نسخ الرابط
                </Button>
              </div>
            </div>

            {post.authors && (
              <div className="mt-8 p-6 rounded-xl border border-border bg-card flex items-start gap-4" data-testid="author-bio">
                {post.authors.avatar ? (
                  <img src={post.authors.avatar} alt={post.authors.name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    {post.authors.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground">{post.authors.name}</p>
                  {post.authors.bio && <p className="text-sm text-muted-foreground mt-1">{post.authors.bio}</p>}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-black text-foreground mb-4">مقالات ذات صلة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((p) => (
                    <ArticleCard key={p.id} post={p} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {headings.length > 0 && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-bold text-sm text-foreground mb-3">محتويات المقال</h3>
                  <nav className="space-y-1">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={cn(
                          "block text-xs text-muted-foreground hover:text-primary transition-colors py-1",
                          h.level === "h3" && "pr-3"
                        )}
                        data-testid={`toc-link-${i}`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all"
          data-testid="button-back-to-top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
      <SiteFooter />
    </div>
  );
}

function extractHeadings(html: string) {
  const re = /<(h[23])[^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h[23]>/gi;
  const headings: { level: string; id: string; text: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    headings.push({ level: m[1], id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return headings;
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
