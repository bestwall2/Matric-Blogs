import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://matric-blogs-26.vercel.app";

function createServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (url && key) {
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const supabase = createServiceClient();
  if (supabase) {
    try {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("slug, updated_at, created_at")
        .or(
          `and(status.eq.published,published_at.lte.${now}),and(status.eq.scheduled,scheduled_at.lte.${now})`
        )
        .order("published_at", { ascending: false });

      if (!error && posts && posts.length > 0) {
        const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
        return [...staticPages, ...postPages];
      }
    } catch (e) {
      console.error("Sitemap: Supabase query failed", e);
    }
  }

  try {
    const res = await fetch(`${SITE_URL}/api/posts?pageSize=200`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const postPages: MetadataRoute.Sitemap = (data.posts ?? []).map((post: any) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
      return [...staticPages, ...postPages];
    }
  } catch (e) {
    console.error("Sitemap: API fetch failed", e);
  }

  return staticPages;
}
