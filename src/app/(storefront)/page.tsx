import { HeroSection } from "@/features/cms/components/hero-section";
import { TestimonialsSection } from "@/features/cms/components/testimonials-section";
import { InstagramSection } from "@/features/cms/components/instagram-section";
import { FeaturedGrid } from "@/features/products/components/featured-grid";
import { getHeroData, getActiveTestimonials, getActiveInstagramPosts } from "@/features/cms/queries/get-homepage-data";
import { getFeaturedProducts, getProducts } from "@/features/products/queries/get-products";

export default async function HomePage() {
  const [hero, featured, newArrivals, testimonials, instagramPosts] = await Promise.all([
    getHeroData(),
    getFeaturedProducts(8),
    getProducts({ newArrival: true, pageSize: 4 }),
    getActiveTestimonials(),
    getActiveInstagramPosts(),
  ]);

  return (
    <>
      <HeroSection data={hero} />

      <FeaturedGrid
        title="New Arrivals"
        subtitle="Just Landed"
        viewAllHref="/collections/new-arrivals"
        products={newArrivals.products}
      />

      <FeaturedGrid
        title="Signature Edit"
        subtitle="Editor's Pick"
        viewAllHref="/collections"
        products={featured}
      />

      <TestimonialsSection testimonials={testimonials} />
      <InstagramSection posts={instagramPosts} />
    </>
  );
}
