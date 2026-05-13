import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, getReadingTime, cn } from "@/lib/utils";

interface ArticleCardProps {
  post: {
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
  };
  featured?: boolean;
  className?: string;
}

export default function ArticleCard({ post, featured, className }: ArticleCardProps) {
  const title = post.title_ar || post.title;
  const cat = post.categories;
  const readingTime = getReadingTime(post.content, post.reading_time);
  const dateStr = formatDate(post.published_at || post.created_at);

  return (
    <Link
      href={`/blog/${post.slug}`}
      data-testid={`card-post-${post.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-primary/30",
        featured && "md:flex md:h-64",
        className
      )}
    >
      <div className={cn(
        "relative overflow-hidden bg-secondary",
        featured ? "md:w-2/5 h-48 md:h-full" : "h-48"
      )}>
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
            <span className="text-4xl font-black text-primary/30">{title.charAt(0)}</span>
          </div>
        )}
        {cat && (
          <div className="absolute top-3 right-3">
            <Badge
              className="text-xs font-semibold px-2 py-0.5"
              style={{ backgroundColor: cat.color || "#e63946", color: "white" }}
            >
              {cat.name_ar || cat.name}
            </Badge>
          </div>
        )}
      </div>

      <div className={cn("p-4 flex flex-col", featured && "md:flex-1 md:justify-center md:p-6")}>
        <h3 className={cn(
          "font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2",
          featured ? "text-xl" : "text-base"
        )}>
          {title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
          <span>{dateStr}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} دقيقة
          </span>
          {(post.view_count ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(post.view_count ?? 0).toLocaleString("ar")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
