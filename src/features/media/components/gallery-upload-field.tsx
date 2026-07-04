"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

export function GalleryUploadField({ label, values, onChange }: { label: string; values: string[]; onChange: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        uploaded.push(data.url);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-wide text-graphite">{label}</p>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url + i} className="relative aspect-[3/4] w-24 overflow-hidden border border-line">
            <Image src={url} alt={`${label} ${i + 1}`} fill className="object-cover" sizes="96px" />
            <button type="button" onClick={() => removeAt(i)} className="absolute right-1 top-1 rounded-full bg-charcoal/80 p-1 text-ivory" aria-label="Remove image">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label className="flex aspect-[3/4] w-24 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-line text-graphite hover:border-charcoal">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span className="text-center text-[10px]">{uploading ? "Uploading..." : "Add photos"}</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" disabled={uploading} />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
