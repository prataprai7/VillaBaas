// Khalti KPG v2 — sandbox (dev.khalti.com) config.
// Get your own test secret key by creating a free account at https://test-admin.khalti.com
const KHALTI_CONFIG = {
  SECRET_KEY: process.env.KHALTI_SECRET_KEY || "",
  INITIATE_URL:
    process.env.KHALTI_PAYMENT_INITIATE_URL || "https://dev.khalti.com/api/v2/epayment/initiate/",
  LOOKUP_URL:
    process.env.KHALTI_PAYMENT_STATUS_CHECK_URL || "https://dev.khalti.com/api/v2/epayment/lookup/",
  RETURN_URL:
    process.env.KHALTI_RETURN_URL || "http://localhost:3000/dashboard/bookings/payment/khalti/return",
  WEBSITE_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};

export interface KhaltiCustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface KhaltiInitiateParams {
  amount: number; // in NPR — this function converts to paisa internally
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerInfo: KhaltiCustomerInfo;
}

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: "Completed" | "Pending" | "Initiated" | "Refunded" | "Expired" | "User canceled";
  transaction_id: string | null;
  fee: number;
  refunded: boolean;
}

/**
 * Calls Khalti's initiate endpoint. Returns a payment_url the frontend
 * should do a full-page redirect to (not a fetch — the user needs to land
 * on Khalti's hosted checkout page).
 */
export async function initiateKhaltiPayment(
  params: KhaltiInitiateParams
): Promise<KhaltiInitiateResponse> {
  const amountInPaisa = Math.round(params.amount * 100); // Khalti always expects paisa

  const res = await fetch(KHALTI_CONFIG.INITIATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${KHALTI_CONFIG.SECRET_KEY}`,
    },
    body: JSON.stringify({
      return_url: KHALTI_CONFIG.RETURN_URL,
      website_url: KHALTI_CONFIG.WEBSITE_URL,
      amount: amountInPaisa,
      purchase_order_id: params.purchaseOrderId,
      purchase_order_name: params.purchaseOrderName,
      customer_info: params.customerInfo,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Khalti initiate failed (${res.status}): ${errBody}`);
  }

  return (await res.json()) as KhaltiInitiateResponse;
}

/**
 * Calls Khalti's lookup endpoint to confirm the real, final status of a
 * transaction server-side. Khalti has no completion webhook — this
 * redirect-then-lookup pattern is the standard, required verification step.
 */
export async function lookupKhaltiPayment(pidx: string): Promise<KhaltiLookupResponse> {
  const res = await fetch(KHALTI_CONFIG.LOOKUP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${KHALTI_CONFIG.SECRET_KEY}`,
    },
    body: JSON.stringify({ pidx }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Khalti lookup failed (${res.status}): ${errBody}`);
  }

  return (await res.json()) as KhaltiLookupResponse;
}