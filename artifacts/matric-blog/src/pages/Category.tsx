import { useState } from "react";
import { useParams } from "wouter";
import { useListPosts, useListCategories, getListPostsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ArticleCard from "@/components/blog/ArticleCard";
import Pagination from "@/components/blog/Pagination";

const PAGE_SIZE = 12;

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data: categories } = useListCategories();
  const { data: listData, isLoading } = useListPosts(
    { page, pageSize: PAGE_SIZE, categorySlug: slug },
    { query: { enabled: !!slug, queryKey: getListPostsQueryKey({ page, pageSize: PAGE_SIZE, categorySlug: slug }) } }
  );

  const cat = (categories ?? []).find((c) => c.slug === slug);
  const posts = listData?.posts ?? [];
  const total = listData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8">
          {cat ? (
            <>
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                style={{ backgroundColor: cat.color || "#e63946" }}
              >
                فئة
              </div>
              <h1 className="text-3xl font-black text-foreground">{cat.name_ar || cat.name}</h1>
              {cat.description && <p className="text-muted-foreground mt-2 text-sm">{cat.description}</p>}
              <p className="text-xs text-muted-foreground mt-1">{total.toLocaleString("ar")} مقال</p>
            </>
          ) : (
            <Skeleton className="h-10 w-48" />
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => <ArticleCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">لا توجد مقالات في هذه الفئة</div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>
      <SiteFooter />
    </div>
  );
}
