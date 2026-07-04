import { db } from "@/lib/db";
import { SettingsForm } from "@/features/settings/components/settings-form";

export default async function AdminSettingsPage() {
  const settings = await db.settings.findUnique({ where: { id: "global" } });
  const data = (settings?.data as { storeName: string; currency: string; supportEmail: string }) ?? {
    storeName: "SROASH.PK",
    currency: "PKR",
    supportEmail: "hello@sroash.pk",
  };
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Store Settings</h1>
      <SettingsForm initial={data} />
    </div>
  );
}
