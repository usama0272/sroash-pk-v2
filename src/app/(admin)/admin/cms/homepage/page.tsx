import { getHeroData } from "@/features/cms/queries/get-homepage-data";
import { HeroEditor } from "@/features/cms/components/hero-editor";

export default async function AdminHomepageCmsPage() {
  const hero = await getHeroData();
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Homepage  Hero Section</h1>
      <HeroEditor initial={hero} />
    </div>
  );
}
