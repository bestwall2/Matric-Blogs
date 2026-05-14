'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useListPosts, useListCategories, getListPostsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/blog/ArticleCard";
import Pagination from "@/components/blog/Pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export default function BlogContent({ initialData, initialCategories }: { initialData: any; initialCategories: any[] }) {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [sort, setSort] = useState<"latest" | "views">((searchParams.get("sort") as any) || "latest");
  const [catSlug, setCatSlug] = useState<string | undefined>(searchParams.get("category") || undefined);
  const [localSearch, setLocalSearch] = useState("");

  const { data: listData, isLoading } = useListPosts(
    { page, pageSize: PAGE_SIZE, sort, ...(catSlug ? { categorySlug: catSlug } : {}) },
    {
      query: {
        queryKey: getListPostsQueryKey({ page, pageSize: PAGE_SIZE, sort, categorySlug: catSlug }),
        initialData: page === 1 && !catSlug && sort === "latest" ? initialData : undefined,
      },
    }
  );
  const { data: categories } = useListCategories({ query: { queryKey: ['categories'], initialData: initialCategories } });

  const posts = listData?.posts ?? [];
  const total = listData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const filtered = localSearch
    ? posts.filter((p: any) => (p.title_ar || p.title).toLowerCase().includes(localSearch.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(localSearch.toLowerCase()))
    : posts;

  useEffect(() => { setPage(1); }, [sort, catSlug]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-1">المدونة</h1>
        <p className="text-muted-foreground text-sm">{total > 0 ? `${total.toLocaleString("ar")} مقال` : "مقالاتنا المتميزة"}</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ابحث في المقالات..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="pr-10 bg-secondary border-border text-right" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><SlidersHorizontal className="w-3 h-3" /> ترتيب:</span>
          {(["latest", "views"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", sort === s ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground")}>
              {s === "latest" ? "الأحدث" : "الأكثر قراءة"}
            </button>
          ))}
          <span className="w-px h-4 bg-border mx-1" />
          <button onClick={() => setCatSlug(undefined)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", !catSlug ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground")}>الكل</button>
          {(categories ?? []).map((cat: any) => (
            <button key={cat.id} onClick={() => setCatSlug(cat.slug === catSlug ? undefined : cat.slug)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", catSlug === cat.slug ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground")}>
              {cat.name_ar || cat.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post: any) => <ArticleCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-semibold mb-2">لا توجد نتائج</p>
          <p className="text-sm">جرب تغيير الفلاتر أو كلمة البحث</p>
        </div>
      )}
      {!localSearch && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </>
  );
}
