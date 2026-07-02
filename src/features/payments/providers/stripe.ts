import type { PaymentProvider } from "@/features/payments/payment-gateway";

export const stripeProvider: PaymentProvider = {
  method: "STRIPE",
  isConfigured: () => Boolean(process.env.STRIPE_SECRET_KEY),

  async initiate({ orderId, orderNumber, amount, currency, customerEmail }) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `SROASH.PK Order ${orderNumber}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId, orderNumber },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
    });

    return {
      requiresRedirect: true,
      redirectUrl: session.url ?? undefined,
      paymentRef: session.id,
    };
  },
};
