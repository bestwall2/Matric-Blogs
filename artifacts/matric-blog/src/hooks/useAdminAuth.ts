import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createClient } from "@/lib/supabase";

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setLocation("/admin/login");
      } else {
        setUser({ id: data.user.id, email: data.user.email });
      }
      setLoading(false);
    });
  }, [setLocation]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setLocation("/admin/login");
  };

  return { user, loading, signOut };
}
