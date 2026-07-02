import type { PaymentProvider } from "@/features/payments/payment-gateway";

export const codProvider: PaymentProvider = {
  method: "COD",
  isConfigured: () => true,
  async initiate() {
    return { requiresRedirect: false };
  },
};
