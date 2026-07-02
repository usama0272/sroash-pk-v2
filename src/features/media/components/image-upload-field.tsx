"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

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
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result) => {
            if (typeof result.info === "object" && result.info && "secure_url" in result.info) {
              onChange(result.info.secure_url as string);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex aspect-[3/4] w-32 flex-col items-center justify-center gap-2 border border-dashed border-line text-graphite hover:border-charcoal"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs">Upload</span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
