import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { siteConfig } from "@/config/site";
import type { InstagramPost } from "@prisma/client";

export function InstagramSection({ posts }: { posts: InstagramPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container-luxury">
        <Reveal className="mb-10 flex items-center justify-between">
          <h2 className="font-display text-3xl">Follow the Story</h2>
          <Link
            href={siteConfig.instagram}
            target="_blank"
            className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-clay transition-colors"
          >
            <Instagram className="h-4 w-4" /> {siteConfig.instagramHandle}
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06} className="relative aspect-square overflow-hidden">
              <Link href={post.postUrl} target="_blank" className="group block h-full w-full">
                <Image
                  src={post.imageUrl}
                  alt={post.caption ?? "Instagram post"}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
