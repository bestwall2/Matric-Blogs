import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  name: string;
  nameAr?: string | null;
  color?: string | null;
  className?: string;
}

export default function CategoryBadge({ name, nameAr, color, className }: CategoryBadgeProps) {
  return (
    <Badge
      className={className}
      style={{ backgroundColor: color || "#e63946", color: "white" }}
    >
      {nameAr || name}
    </Badge>
  );
}
