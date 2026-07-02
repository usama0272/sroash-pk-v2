"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-[72px_1fr] gap-3">
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[3/4] w-full overflow-hidden border transition-colors",
              active === i ? "border-charcoal" : "border-transparent"
            )}
          >
            <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="72px" />
          </button>
        ))}
      </div>

      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active] ?? images[0]}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
