import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ArticleClient from "./ArticleClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://matric-blogs-26.vercel.app";
const API_URL = `${SITE_URL}/api`;

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/posts?pageSize=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch { return []; }
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "مقال غير موجود" };

  const title = post.title_ar || post.title;
  const description = post.meta_description || post.excerpt || "";
  const image = post.featured_image || `${SITE_URL}/og-default.png`;
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: post.title_ar || post.meta_title || post.title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at || post.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, related] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  const title = post.title_ar || post.title;
  const description = post.meta_description || post.excerpt || "";
  const image = post.featured_image || `${SITE_URL}/og-default.png`;
  const url = `${SITE_URL}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        image,
        author: {
          "@type": "Person",
          name: post.authors?.name || "ماتريكبلوغ",
        },
        publisher: {
          "@type": "Organization",
          name: "ماتريكبلوغ",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        },
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.created_at,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "المدونة", "item": `${SITE_URL}/blog` },
          { "@type": "ListItem", "position": 3, "name": title, "item": url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <ArticleClient post={post} related={related} />
      <SiteFooter />
    </div>
  );
}
