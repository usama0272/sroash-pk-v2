import crypto from "crypto";
import type { PaymentProvider } from "@/features/payments/payment-gateway";

/**
 * JazzCash Hosted Checkout Page (HPP) integration.
 * Docs: JazzCash Payment Gateway - Mobile Account / Card HPP API.
 * Requires JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, JAZZCASH_INTEGRITY_SALT.
 */
export const jazzCashProvider: PaymentProvider = {
  method: "JAZZCASH",
  isConfigured: () =>
    Boolean(
      process.env.JAZZCASH_MERCHANT_ID &&
        process.env.JAZZCASH_PASSWORD &&
        process.env.JAZZCASH_INTEGRITY_SALT
    ),

  async initiate({ orderId, orderNumber, amount }) {
    const merchantId = process.env.JAZZCASH_MERCHANT_ID;
    const password = process.env.JAZZCASH_PASSWORD;
    const salt = process.env.JAZZCASH_INTEGRITY_SALT;

    if (!merchantId || !password || !salt) {
      throw new Error("JazzCash is not configured.");
    }

    const txnDateTime = new Date()
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);
    const txnRefNo = `T${orderNumber.replace(/-/g, "")}`;
    const amountPaisa = String(Math.round(amount * 100));

    const fields: Record<string, string> = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amountPaisa,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: orderId,
      pp_Description: `SROASH.PK Order ${orderNumber}`,
      pp_ReturnURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/jazzcash`,
    };

    const sorted = Object.keys(fields).sort();
    const hashString = salt + "&" + sorted.map((k) => fields[k]).join("&");
    const secureHash = crypto.createHmac("sha256", salt).update(hashString).digest("hex");

    return {
      requiresRedirect: true,
      redirectUrl: `${process.env.JAZZCASH_HPP_URL ?? "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform"}?${new URLSearchParams(
        { ...fields, pp_SecureHash: secureHash }
      ).toString()}`,
      paymentRef: txnRefNo,
    };
  },
};
