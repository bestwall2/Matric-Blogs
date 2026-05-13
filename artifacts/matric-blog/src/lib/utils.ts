import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("ar-MA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function getReadingTime(content: string | null | undefined, rt?: number | null): number {
  if (rt) return rt;
  if (!content) return 1;
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getApiBase(): string {
  const base = process.env.BASE_PATH ?? "/";
  return base.replace(/\/$/, "") + "/api";
}
