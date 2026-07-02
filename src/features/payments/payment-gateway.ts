import "server-only";
import type { PaymentMethod } from "@prisma/client";
import { codProvider } from "@/features/payments/providers/cod";

export interface PaymentInitResult {
  requiresRedirect: boolean;
  redirectUrl?: string;
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

const providers: Partial<Record<PaymentMethod, PaymentProvider>> = {
  COD: codProvider,
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  const provider = providers[method];
  if (!provider) throw new Error(`Payment method not available: ${method}`);
  return provider;
}

export function getAvailablePaymentMethods(): PaymentMethod[] {
  return (Object.values(providers) as PaymentProvider[])
    .filter((p) => p.isConfigured())
    .map((p) => p.method);
}
