"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { adminNav } from "@/config/admin-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = adminNav.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 shrink-0 border-r border-line bg-ivory">
      <div className="px-6 py-6">
        <p className="font-display text-xl tracking-widest">SROASH.PK</p>
        <p className="text-xs uppercase tracking-widest text-graphite">Admin Console</p>
      </div>
      <nav className="space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active ? "bg-charcoal text-ivory" : "text-graphite hover:bg-sand/60"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
