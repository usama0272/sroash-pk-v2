import { Star } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import type { Testimonial } from "@prisma/client";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-sand/40 py-24">
      <div className="container-luxury">
        <Reveal className="text-center">
          <p className="eyebrow">What they&apos;re saying</p>
          <h2 className="mt-2 font-display text-4xl">Loved, Worn, Trusted</h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <blockquote className="h-full border border-line bg-ivory p-8">
                <div className="flex gap-1 text-clay">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-clay" />
                  ))}
                </div>
                <p className="mt-4 font-display text-lg italic text-graphite">&quot;{t.quote}&quot;</p>
                <footer className="mt-6 text-sm uppercase tracking-widest text-charcoal">
                  {t.name}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

