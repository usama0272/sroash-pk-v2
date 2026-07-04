"use client";
import { useState } from "react";
import Image from "next/image";
import { Ruler, X } from "lucide-react";

export function SizeChartModal({ imageUrl }: { imageUrl: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs uppercase tracking-wide text-graphite hover:text-charcoal">
        <Ruler className="h-3.5 w-3.5" /> Size Chart
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/60 p-6" onClick={() => setOpen(false)}>
          <div className="relative max-h-[85vh] max-w-lg overflow-auto bg-ivory p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full bg-charcoal/80 p-1.5 text-ivory" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-auto">
              <Image src={imageUrl} alt="Size chart" width={600} height={800} className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
