"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateSettings } from "@/features/cms/actions/update-settings.action";

interface SettingsData { storeName: string; currency: string; supportEmail: string; }

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const [data, setData] = useState(initial);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); startTransition(async () => { await updateSettings(data); toast.success("Settings saved."); }); }}
      className="max-w-md space-y-4"
    >
      <div>
        <label className="mb-1 block text-xs uppercase text-graphite">Store Name</label>
        <input value={data.storeName} onChange={(e) => setData({ ...data, storeName: e.target.value })} className="input-luxury" />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase text-graphite">Currency</label>
        <input value={data.currency} onChange={(e) => setData({ ...data, currency: e.target.value })} className="input-luxury" />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase text-graphite">Support Email</label>
        <input value={data.supportEmail} onChange={(e) => setData({ ...data, supportEmail: e.target.value })} className="input-luxury" />
      </div>
      <button disabled={isPending} className="btn-luxury-dark">{isPending ? "Saving..." : "Save Settings"}</button>
    </form>
  );
}
