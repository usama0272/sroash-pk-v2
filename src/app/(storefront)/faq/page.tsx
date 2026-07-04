const FAQS = [
  { q: "How long does shipping take?", a: "Ready-to-wear orders ship within 2-3 business days and arrive within 5-7 days across Pakistan. Made-to-order pieces take 2-3 weeks to craft before shipping." },
  { q: "Do you offer Cash on Delivery?", a: "Yes, COD is available nationwide. We also accept bank transfer, with more payment options coming soon." },
  { q: "What is your return policy?", a: "Ready-to-wear items can be returned within 7 days of delivery if unworn and with tags attached. Made-to-order pieces are final sale due to their custom nature." },
  { q: "How do I know what size to order?", a: "Each product page lists available sizes. If you're between sizes or unsure, reach out to us before ordering and we're happy to help." },
  { q: "Can I track my order?", a: "Yes, use the Track Order page with your order number, or check your account's Order History if you created an account at checkout." },
];

export default function FaqPage() {
  return (
    <div className="container-luxury max-w-2xl py-20">
      <h1 className="font-display text-5xl mb-10">Frequently Asked Questions</h1>
      <div className="divide-y divide-line">
        {FAQS.map((item) => (
          <div key={item.q} className="py-6">
            <p className="font-medium mb-2">{item.q}</p>
            <p className="text-graphite text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
