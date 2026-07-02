import Link from "next/link";
import { Instagram } from "lucide-react";
import { footerNav, siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/layout/footer/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ivory">
      <div className="container-luxury grid gap-12 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl tracking-widest">{siteConfig.name}</p>
          <p dir="rtl" className="mt-2 font-urdu text-xl text-clay">
            {siteConfig.taglineUrdu}
          </p>
          <p className="mt-4 max-w-xs text-sm text-graphite">{siteConfig.description}</p>
          <Link
            href={siteConfig.instagram}
            target="_blank"
            className="mt-6 inline-flex items-center gap-2 text-sm hover:text-clay transition-colors"
          >
            <Instagram className="h-4 w-4" /> {siteConfig.instagramHandle}
          </Link>
        </div>

        <FooterColumn title="Shop" links={footerNav.shop} />
        <FooterColumn title="Support" links={footerNav.support} />

        <div>
          <p className="eyebrow mb-4">Stay in the fold</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-luxury flex flex-col items-center justify-between gap-4 py-6 text-xs text-graphite sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            {footerNav.company.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-charcoal">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { title: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-graphite hover:text-charcoal transition-colors">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
