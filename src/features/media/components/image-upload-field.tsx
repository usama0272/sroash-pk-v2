"use client";

import Image from "next/image";
import { X } from "lucide-react";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-wide text-graphite">{label}</p>
      {value && (
        <div className="relative mb-2 aspect-[3/4] w-32 overflow-hidden border border-line">
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
      )}
      <input
        type="url"
        placeholder="https://images.unsplash.com/..."
        defaultValue={value ?? ""}
        onBlur={(e) => onChange(e.target.value || null)}
        className="input-luxury"
      />
      <p className="mt-1 text-[11px] text-graphite">Paste any image URL for now (Cloudinary upload can be wired up later).</p>
    </div>
  );
}
