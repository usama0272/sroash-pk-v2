"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateHomepageHero } from "@/features/cms/actions/update-hero.action";

interface HeroData { image: string; headline: string; subheadline: string; ctaLabel: string; ctaHref: string; }

export function HeroEditor({ initial }: { initial: HeroData }) {
  const [data, setData] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateHomepageHero(data);
      toast.success("Homepage hero updated.");
    });
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-xs uppercase text-graphite">Image URL</label>
        <input value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })} className="input-luxury" />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase text-graphite">Headline</label>
        <input value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} className="input-luxury" />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase text-graphite">Subheadline</label>
        <textarea value={data.subheadline} onChange={(e) => setData({ ...data, subheadline: e.target.value })} className="input-luxury" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs uppercase text-graphite">Button Label</label>
          <input value={data.ctaLabel} onChange={(e) => setData({ ...data, ctaLabel: e.target.value })} className="input-luxury" />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase text-graphite">Button Link</label>
          <input value={data.ctaHref} onChange={(e) => setData({ ...data, ctaHref: e.target.value })} className="input-luxury" />
        </div>
      </div>
      <button disabled={isPending} className="btn-luxury-dark">{isPending ? "Saving..." : "Save Changes"}</button>
    </form>
  );
}
