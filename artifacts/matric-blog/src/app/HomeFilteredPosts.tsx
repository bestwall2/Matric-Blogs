'use client';

import { useState } from "react";
import ArticleCard from "@/components/blog/ArticleCard";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  slug: string;
  title: string;
  title_ar?: string | null;
  excerpt?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  created_at: string;
  view_count?: number | null;
  reading_time?: number | null;
  content: string;
  categories?: { name: string; name_ar?: string | null; slug: string; color?: string | null } | null;
}

interface Category {
  id: string;
  name: string;
  name_ar?: string | null;
  slug: string;
  color?: string | null;
}

export default function HomeFilteredPosts({ posts, categories }: { posts: Post[]; categories: Category[] }) {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = activeCat
    ? posts.filter((p) => p.categories?.slug === activeCat)
    : posts;

  return (
    <>
      {categories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCat(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCat === null
                ? "bg-primary text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
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
            >
              {cat.name_ar || cat.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">لا توجد مقالات في هذه الفئة</p>
      )}
    </>
  );
}
