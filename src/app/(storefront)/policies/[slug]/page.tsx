import { notFound } from "next/navigation";

const POLICIES: Record<string, { title: string; body: string[] }> = {
  shipping: {
    title: "Shipping Policy",
    body: [
      "We ship nationwide across Pakistan. Ready-to-wear orders are dispatched within 2-3 business days and typically arrive within 5-7 days depending on your location.",
      "Made-to-order pieces are handcrafted after your order is placed and typically take 2-3 weeks before shipping.",
      "Orders over PKR 15,000 qualify for free shipping. A flat PKR 350 shipping fee applies below that threshold.",
      "You will receive a tracking number once your order ships. Delays may occur during high-demand periods or due to courier disruptions outside our control.",
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    body: [
      "Ready-to-wear items may be returned within 7 days of delivery, provided they are unworn, unwashed, and have all original tags attached.",
      "To initiate a return, contact us with your order number and reason for return. Once approved, ship the item back to our studio address.",
      "Made-to-order pieces are custom-crafted for you and are final sale  we're unable to accept returns or exchanges on these items unless there is a manufacturing defect.",
      "Refunds are processed to your original payment method (or store credit for Cash on Delivery orders) within 7-10 business days of us receiving the returned item.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information necessary to process your order: your name, contact details, shipping address, and order history.",
      "We never sell your personal information to third parties. Payment information is processed securely and is not stored on our servers.",
      "We may use your email to send order updates and, if you've subscribed, occasional updates about new collections. You can unsubscribe at any time.",
      "For any questions about how your data is handled, contact us at hello@sroash.pk.",
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      "By using this website and placing an order, you agree to these terms. All product descriptions, images, and pricing are accurate to the best of our knowledge at the time of listing.",
      "Prices are listed in Pakistani Rupees (PKR) and are subject to change without notice. Orders are confirmed once payment is received or, for Cash on Delivery, once the order is placed.",
      "We reserve the right to cancel orders in cases of suspected fraud, pricing errors, or stock unavailability, with a full refund issued in such cases.",
      "All content on this site, including designs, photography, and branding, is the property of SROASH.PK and may not be reproduced without permission.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="container-luxury max-w-2xl py-20">
      <h1 className="font-display text-5xl mb-10">{policy.title}</h1>
      <div className="space-y-5 text-graphite leading-relaxed">
        {policy.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </div>
  );
}
