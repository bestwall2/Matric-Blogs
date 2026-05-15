'use client';

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-right" | "scale-in";
  delay?: number; // milliseconds
  threshold?: number; // 0–1, how much of element must be visible
}

export default function AnimateOnScroll({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animationMap = {
    "fade-up":    { hidden: "opacity-0 translate-y-5", visible: "opacity-100 translate-y-0" },
    "fade-in":    { hidden: "opacity-0",               visible: "opacity-100" },
    "fade-right": { hidden: "opacity-0 -translate-x-5",visible: "opacity-100 translate-x-0" },
    "scale-in":   { hidden: "opacity-0 scale-95",      visible: "opacity-100 scale-100" },
  };

  const { hidden, visible: visibleClass } = animationMap[animation];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? visibleClass : hidden,
        className
      )}
    >
      {children}
    </div>
  );
}
