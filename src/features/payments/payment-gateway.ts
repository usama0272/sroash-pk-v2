import "server-only";
import type { PaymentMethod } from "@prisma/client";

export interface PaymentInitResult {
  /** True if the order can be confirmed immediately (e.g. COD, bank transfer). */
  requiresRedirect: boolean;
  /** URL to redirect the customer to for hosted checkout, if applicable. */
  redirectUrl?: string;
  /** Provider-side reference to store against the order. */
  paymentRef?: string;
}

export interface PaymentProvider {
  method: PaymentMethod;
  isConfigured(): boolean;
  initiate(params: {
    orderId: string;
    orderNumber: string;
    amount: number;
    currency: string;
    customerEmail: string;
  }): Promise<PaymentInitResult>;
}

import { stripeProvider } from "@/features/payments/providers/stripe";
import { jazzCashProvider } from "@/features/payments/providers/jazzcash";
import { easyPaisaProvider } from "@/features/payments/providers/easypaisa";
import { bankTransferProvider } from "@/features/payments/providers/bank-transfer";
import { codProvider } from "@/features/payments/providers/cod";

const providers: Record<PaymentMethod, PaymentProvider> = {
  STRIPE: stripeProvider,
  JAZZCASH: jazzCashProvider,
  EASYPAISA: easyPaisaProvider,
  BANK_TRANSFER: bankTransferProvider,
  COD: codProvider,
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  const provider = providers[method];
  if (!provider) throw new Error(`Unknown payment method: ${method}`);
  return provider;
}

export function getAvailablePaymentMethods(): PaymentMethod[] {
  return (Object.values(providers) as PaymentProvider[])
    .filter((p) => p.isConfigured())
    .map((p) => p.method);
}
