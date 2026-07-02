import crypto from "crypto";
import type { PaymentProvider } from "@/features/payments/payment-gateway";

/**
 * EasyPaisa Open API (hosted checkout) integration.
 * Requires EASYPAISA_STORE_ID and EASYPAISA_HASH_KEY.
 */
export const easyPaisaProvider: PaymentProvider = {
  method: "EASYPAISA",
  isConfigured: () => Boolean(process.env.EASYPAISA_STORE_ID && process.env.EASYPAISA_HASH_KEY),

  async initiate({ orderId, orderNumber, amount }) {
    const storeId = process.env.EASYPAISA_STORE_ID;
    const hashKey = process.env.EASYPAISA_HASH_KEY;

    if (!storeId || !hashKey) {
      throw new Error("EasyPaisa is not configured.");
    }

    const orderRefNum = orderNumber.replace(/-/g, "");
    const amountStr = amount.toFixed(2);
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);

    const payload = `${storeId}&${orderRefNum}&${amountStr}&${expiryDate}`;
    const merchantHashedReq = crypto.createHmac("sha256", hashKey).update(payload).digest("hex");

    return {
      requiresRedirect: true,
      redirectUrl: `${process.env.EASYPAISA_HPP_URL ?? "https://easypay.easypaisa.com.pk/easypay/Index.jsf"}?${new URLSearchParams(
        {
          storeId,
          orderRefNum,
          amount: amountStr,
          postBackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/easypaisa`,
          expiryDate,
          merchantHashedReq,
          orderId,
        }
      ).toString()}`,
      paymentRef: orderRefNum,
    };
  },
};
