import type { Role } from "@prisma/client";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  Ticket,
  Star,
  ImageIcon,
  BarChart3,
  LayoutTemplate,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

export const adminNav: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Products", href: "/admin/products", icon: Package, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Categories", href: "/admin/categories", icon: FolderTree, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Inventory", href: "/admin/inventory", icon: Boxes, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Coupons", href: "/admin/coupons", icon: Ticket, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Reviews", href: "/admin/reviews", icon: Star, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Media", href: "/admin/media", icon: ImageIcon, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "CMS", href: "/admin/cms/homepage", icon: LayoutTemplate, roles: ["ADMIN", "SUPER_ADMIN"] },
  { title: "Users", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN"] },
  { title: "Roles & Permissions", href: "/admin/roles-permissions", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
  { title: "Settings", href: "/admin/settings", icon: Settings, roles: ["SUPER_ADMIN"] },
];
