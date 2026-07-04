"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

function isVideo(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url);
}

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-wide text-graphite">{label}</p>
      {value ? (
        <div className="relative aspect-[3/4] w-32 overflow-hidden border border-line">
          {isVideo(value) ? (
            <video src={value} className="h-full w-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <Image src={value} alt={label} fill className="object-cover" sizes="128px" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-charcoal/80 p-1 text-ivory"
            aria-label="Remove media"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex aspect-[3/4] w-32 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line text-graphite hover:border-charcoal">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-center text-[11px]">{uploading ? "Uploading..." : "Upload image or video"}</span>
          <input type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
