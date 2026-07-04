"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

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

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-wide text-graphite">{label}</p>
      {value ? (
        <div className="relative aspect-[3/4] w-32 overflow-hidden border border-line">
          <Image src={value} alt={label} fill className="object-cover" sizes="128px" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-charcoal/80 p-1 text-ivory"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex aspect-[3/4] w-32 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line text-graphite hover:border-charcoal">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-xs">{uploading ? "Uploading..." : "Upload from computer"}</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
}
