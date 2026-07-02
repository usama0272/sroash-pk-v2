# SROASH.PK

Luxury Pakistani fashion e-commerce platform — Next.js 15, React 19, TypeScript, Prisma, PostgreSQL, Auth.js, Cloudinary.

## What's included in this pass

- **Database**: full Prisma schema — RBAC (Super Admin / Admin / Customer), products, variants, categories, cart, wishlist, orders, coupons, reviews, CMS sections, testimonials, Instagram feed, audit log, newsletter.
- **Auth & RBAC**: Auth.js v5 credentials login, JWT sessions carrying `role`, route-level middleware protecting `/admin` and `/account`, server-side permission guards (`requirePermission`, `requireRole`) for use in server actions.
- **Storefront**: animated homepage (hero, featured/new-arrival grids, testimonials, Instagram section — all CMS-driven with sane defaults), collections/categories listing with filters, product detail page with gallery + variant selector, cart (Zustand, persisted) with drawer + full page, checkout with server-trusted price/stock recalculation, coupon validation, and a modular payment-provider architecture (COD and Bank Transfer working now; Stripe/JazzCash/EasyPaisa wired to real hosted-checkout integrations, activate by adding API keys).
- **Admin**: RBAC-gated `/admin` shell, dashboard stats, full product CRUD (create/edit/soft-delete/toggle) with an image upload field (Cloudinary) and variant repeater, audit logging on every mutation.
- **Auth pages**: login, register, forgot/reset password (token-based via `VerificationToken`).

## Not yet built (next passes, one feature at a time per the brief)

Categories admin CRUD, inventory dashboard, orders admin + customer order tracking, coupons admin, reviews moderation + submission form, media library, analytics dashboard, full CMS editor screens (banners/about/FAQ/policies/footer/announcements), account pages (addresses, wishlist, settings), Stripe/JazzCash/EasyPaisa webhook handlers, cron inventory checks.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL at minimum
npx auth secret         # writes AUTH_SECRET into .env
npm run db:push         # or db:migrate for a tracked migration
npm run db:seed         # creates super admin + sample catalogue
npm run dev
```

**Seeded super admin:** `admin@sroash.pk` / `ChangeMe123!` — change this password immediately in a real deployment.

Drop a hero photo at `public/images/hero.jpg` (1920×1080+ recommended) — the homepage and seed data reference it by default; CMS admin will let you swap it once the CMS screens are built.

## Payment providers

Each provider in `src/features/payments/providers/` implements the same interface and reports `isConfigured()` based on env vars — add keys to activate JazzCash/EasyPaisa/Stripe without touching checkout logic.
