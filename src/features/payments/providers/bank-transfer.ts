import type { PaymentProvider } from "@/features/payments/payment-gateway";

export const bankTransferProvider: PaymentProvider = {
  method: "BANK_TRANSFER",
  isConfigured: () => true,
  async initiate() {
    // Order stays PENDING until an admin reconciles the transfer against bank statements.
    return { requiresRedirect: false };
  },
};
