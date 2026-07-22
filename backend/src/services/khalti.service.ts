const KHALTI_SECRET_KEY   = process.env.KHALTI_SECRET_KEY || "";
const KHALTI_INITIATE_URL = process.env.KHALTI_PAYMENT_INITIATE_URL || "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL   = process.env.KHALTI_PAYMENT_STATUS_CHECK_URL || "https://dev.khalti.com/api/v2/epayment/lookup/";
const KHALTI_RETURN_URL   = process.env.KHALTI_RETURN_URL || "http://localhost:3000/dashboard/bookings/payment/khalti/return";
const FRONTEND_URL        = process.env.FRONTEND_URL || "http://localhost:3000";

export interface KhaltiCustomerInfo {
    name: string;
    email: string;
    phone: string;
}

export interface KhaltiInitiateResponse {
    pidx: string;
    payment_url: string;
    expires_at: string;
    expires_in: number;
}

export interface KhaltiLookupResponse {
    pidx: string;
    total_amount: number; // in paisa
    status: "Completed" | "Pending" | "Initiated" | "Refunded" | "Expired" | "User canceled";
    transaction_id: string | null;
    fee: number;
    refunded: boolean;
}

/**
 * Calls Khalti's initiate endpoint. amountNPR is in normal rupees —
 * this converts to paisa internally since Khalti's API requires paisa.
 */
export async function initiateKhaltiPayment(params: {
    amountNPR: number;
    purchaseOrderId: string;
    purchaseOrderName: string;
    customerInfo: KhaltiCustomerInfo;
}): Promise<KhaltiInitiateResponse> {
    const res = await fetch(KHALTI_INITIATE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
        },
        body: JSON.stringify({
            return_url: KHALTI_RETURN_URL,
            website_url: FRONTEND_URL,
            amount: Math.round(params.amountNPR * 100),
            purchase_order_id: params.purchaseOrderId,
            purchase_order_name: params.purchaseOrderName,
            customer_info: params.customerInfo,
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Khalti initiate failed (${res.status}): ${body}`);
    }

    return (await res.json()) as KhaltiInitiateResponse;
}

/**
 * Server-side confirmation of a transaction's real status. Khalti has no
 * completion webhook — this is the required verification step.
 */
export async function lookupKhaltiPayment(pidx: string): Promise<KhaltiLookupResponse> {
    const res = await fetch(KHALTI_LOOKUP_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
        },
        body: JSON.stringify({ pidx }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Khalti lookup failed (${res.status}): ${body}`);
    }

    return (await res.json()) as KhaltiLookupResponse;
}