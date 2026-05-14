'use client';

import { useState } from "react";
import { Plus } from "lucide-react";
import { useListCategories, getListCategoriesQueryKey, useCreateCategory } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

export default function AdminCategories() {
  const { loading: authLoading, signOut } = useAdminAuth();
  const { data: cats, isLoading } = useListCategories();
  const createCat = useCreateCategory();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", name_ar: "", slug: "", description: "", color: "#e63946" });

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">جاري التحقق...</div></div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCat.mutate(
      { data: { name: form.name, name_ar: form.name_ar || null, slug: form.slug || slugify(form.name), description: form.description || null, color: form.color || null } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          toast.success("تم إنشاء الفئة");
          setOpen(false);
          setForm({ name: "", name_ar: "", slug: "", description: "", color: "#e63946" });
        },
        onError: () => toast.error("فشل إنشاء الفئة"),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <AdminSidebar onSignOut={signOut} />
      <div className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-foreground">الفئات</h1>
              <p className="text-sm text-muted-foreground">{(cats ?? []).length} فئة</p>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1.5" onClick={() => setOpen(true)} data-testid="button-new-category">
              <Plus className="w-4 h-4" /> فئة جديدة
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />)
            ) : (cats ?? []).map((cat) => (
              <div key={cat.id} className="rounded-xl border border-border bg-card p-5" data-testid={`card-cat-${cat.id}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || "#e63946" }} />
                  <h3 className="font-bold text-foreground text-sm">{cat.name_ar || cat.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{cat.slug}</p>
                {cat.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-black">فئة جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2" data-testid="form-category">
            <div className="space-y-1.5">
              <Label>الاسم (إنجليزي)</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required className="bg-secondary border-border" data-testid="input-cat-name" />
            </div>
            <div className="space-y-1.5">
              <Label>الاسم بالعربية</Label>
              <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="bg-secondary border-border text-right" data-testid="input-cat-name-ar" />
            </div>
            <div className="space-y-1.5">
              <Label>الرابط (slug)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="bg-secondary border-border" data-testid="input-cat-slug" />
            </div>
            <div className="space-y-1.5">
              <Label>الوصف</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border text-right" data-testid="input-cat-desc" />
            </div>
            <div className="space-y-1.5">
              <Label>اللون</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent" data-testid="input-cat-color" />
                <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="bg-secondary border-border" />
              </div>
            </div>
            <Button type="submit" disabled={createCat.isPending} className="w-full bg-primary hover:bg-primary/90 text-white" data-testid="button-create-category">
              {createCat.isPending ? "جاري الإنشاء..." : "إنشاء الفئة"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
