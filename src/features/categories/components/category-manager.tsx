"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCategory, toggleCategory } from "@/features/categories/actions/category.actions";

export function CategoryManager({ categories }: { categories: { id: string; name: string; description: string | null; isActive: boolean; _count: { products: number } }[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createCategory(name, description);
      if (result.error) toast.error(result.error);
      else { toast.success("Category created."); setName(""); setDescription(""); }
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleCreate} className="space-y-3 border border-line bg-ivory p-6">
        <p className="eyebrow">New Category</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input-luxury" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="input-luxury" />
        <button disabled={isPending} className="btn-luxury-dark">{isPending ? "Saving..." : "Add Category"}</button>
      </form>

      <div className="border border-line bg-ivory divide-y divide-line">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-graphite">{c._count.products} products</p>
            </div>
            <button
              onClick={() => startTransition(async () => { await toggleCategory(c.id, !c.isActive); })}
              className={`text-xs uppercase tracking-wide px-3 py-1 rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-graphite/10 text-graphite"}`}
            >
              {c.isActive ? "Active" : "Hidden"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
