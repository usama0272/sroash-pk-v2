import { db } from "@/lib/db";

export default async function AdminMediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Media Library</h1>
      <p className="text-graphite mb-6 text-sm">Product images are currently added by pasting a URL directly on the product form. A dedicated upload library can be wired up here later.</p>
      {media.length === 0 ? (
        <p className="text-graphite">No media records yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.map((m) => (
            <div key={m.id} className="aspect-square bg-sand bg-cover bg-center border border-line" style={{ backgroundImage: `url(${m.url})` }} />
          ))}
        </div>
      )}
    </div>
  );
}
