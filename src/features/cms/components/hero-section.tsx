"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

interface HeroData {
  image: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
}

export function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="relative h-[92vh] w-full overflow-hidden bg-charcoal">
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image src={data.image} alt={data.headline} fill priority className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      </motion.div>

      <div className="relative z-10 flex h-full items-end lg:items-center">
        <div className="container-luxury pb-20 lg:pb-0">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="eyebrow text-ivory/80"
            >
              {siteConfig.name}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 font-display text-5xl leading-[1.05] text-ivory lg:text-7xl"
            >
              {data.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.8 }}
              className="mt-6 max-w-md text-ivory/85"
            >
              {data.subheadline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.8 }}
              className="mt-9"
            >
              <Link href={data.ctaHref} className="btn-luxury bg-ivory text-charcoal hover:bg-sand">
                {data.ctaLabel}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
