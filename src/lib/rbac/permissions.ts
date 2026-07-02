import type { Role } from "@prisma/client";

export const PERMISSIONS = {
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",
  INVENTORY_MANAGE: "inventory.manage",
  ORDERS_MANAGE: "orders.manage",
  MEDIA_UPLOAD: "media.upload",
  CMS_EDIT: "cms.edit",
  COUPONS_MANAGE: "coupons.manage",
  REVIEWS_MODERATE: "reviews.moderate",
  ANALYTICS_VIEW: "analytics.view",
  USERS_MANAGE: "users.manage",
  ADMINS_MANAGE: "admins.manage",
  SETTINGS_MANAGE: "settings.manage",
  RBAC_MANAGE: "rbac.manage",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.REVIEWS_MODERATE,
  ],
  CUSTOMER: [],
};

export function roleHasPermission(role: Role, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissionsForRole(role: Role): PermissionKey[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
