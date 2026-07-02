import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand/30 px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 block text-center font-display text-3xl tracking-widest text-charcoal">
          {siteConfig.name}
        </Link>
        <div className="border border-line bg-ivory p-8">{children}</div>
      </div>
    </div>
  );
}
