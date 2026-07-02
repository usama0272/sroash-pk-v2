import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const superAdminPassword = await bcrypt.hash("ChangeMe123!", 12);

  const superAdmin = await db.user.upsert({
    where: { email: "admin@sroash.pk" },
    update: {},
    create: {
      name: "SROASH Super Admin",
      email: "admin@sroash.pk",
      passwordHash: superAdminPassword,
      role: "SUPER_ADMIN",
    },
  });

  const readyToWear = await db.category.upsert({
    where: { slug: "ready-to-wear" },
    update: {},
    create: {
      name: "Ready to Wear",
      slug: "ready-to-wear",
      description: "Handcrafted pieces ready to ship.",
      sortOrder: 1,
    },
  });

  const madeToOrder = await db.category.upsert({
    where: { slug: "made-to-order" },
    update: {},
    create: {
      name: "Made to Order",
      slug: "made-to-order",
      description: "Bespoke pieces tailored to you.",
      sortOrder: 2,
    },
  });

  const existingProduct = await db.product.findUnique({ where: { slug: "rose-silk-kurta" } });
  if (!existingProduct) {
    await db.product.create({
      data: {
        name: "Rose Silk Kurta",
        slug: "rose-silk-kurta",
        description:
          "A hand-finished silk kurta in dusty rose, featuring subtle thread embroidery along the neckline. Designed for warm-weather elegance.",
        fabric: "Pure Silk",
        careInstructions: "Dry clean only.",
        sku: "SR-KUR-001",
        price: 8500,
        heroImage: "/images/hero.jpg",
        gallery: [],
        isFeatured: true,
        isNewArrival: true,
        categoryId: readyToWear.id,
        createdById: superAdmin.id,
        variants: {
          create: [
            { size: "S", color: "Rose", sku: "SR-KUR-001-S-ROSE", stock: 6 },
            { size: "M", color: "Rose", sku: "SR-KUR-001-M-ROSE", stock: 8 },
            { size: "L", color: "Rose", sku: "SR-KUR-001-L-ROSE", stock: 4 },
          ],
        },
      },
    });
  }

  const existingShawl = await db.product.findUnique({ where: { slug: "ivory-embroidered-shawl" } });
  if (!existingShawl) {
    await db.product.create({
      data: {
        name: "Ivory Embroidered Shawl",
        slug: "ivory-embroidered-shawl",
        description:
          "An heirloom-quality shawl made to order, hand-embroidered by our artisan partners over three weeks.",
        fabric: "Pashmina Wool",
        careInstructions: "Dry clean only. Store folded in breathable fabric.",
        sku: "SR-SHW-002",
        price: 18500,
        heroImage: "/images/hero.jpg",
        gallery: [],
        isFeatured: true,
        isMadeToOrder: true,
        categoryId: madeToOrder.id,
        createdById: superAdmin.id,
        variants: {
          create: [{ size: "One Size", color: "Ivory", sku: "SR-SHW-002-OS-IVORY", stock: 3 }],
        },
      },
    });
  }

  await db.cmsSection.upsert({
    where: { key: "homepage_hero" },
    update: {},
    create: {
      key: "homepage_hero",
      data: {
        image: "/images/hero.jpg",
        headline: "Timeless Comfort, Everyday You",
        subheadline:
          "Handcrafted ready-to-wear and made-to-order pieces, designed for the way you actually live.",
        ctaLabel: "Shop New Arrivals",
        ctaHref: "/collections/new-arrivals",
      },
    },
  });

  await db.settings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      data: {
        storeName: "SROASH.PK",
        currency: "PKR",
        supportEmail: "hello@sroash.pk",
      },
    },
  });

  console.log("Seed complete.");
  console.log("Super admin login: admin@sroash.pk / ChangeMe123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
