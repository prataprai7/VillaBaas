import { Request, Response } from "express";
import { initiateKhaltiPayment, lookupKhaltiPayment } from "../services/khaltiService";

/**
 * POST /api/payments/khalti/initiate
 * body: { amount, purchaseOrderId, purchaseOrderName, customerInfo }
 * Returns { pidx, payment_url } — frontend does a full-page redirect to payment_url.
 */
export async function initiate(req: Request, res: Response) {
  try {
    const { amount, purchaseOrderId, purchaseOrderName, customerInfo } = req.body as {
      amount: number;
      purchaseOrderId: string;
      purchaseOrderName: string;
      customerInfo: { name: string; email: string; phone: string };
    };

    if (!amount || !purchaseOrderId || !customerInfo) {
      return res.status(400).json({ message: "Missing required payment details" });
    }

    const result = await initiateKhaltiPayment({
      amount,
      purchaseOrderId,
      purchaseOrderName,
      customerInfo,
    });

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("Khalti initiate error:", err);
    return res.status(500).json({ message: "Failed to initiate Khalti payment" });
  }
}

/**
 * GET /api/payments/khalti/verify?pidx=...
 * Called by the frontend after Khalti redirects the user back.
 * Confirms the real transaction status server-side before trusting it.
 */
export async function verify(req: Request, res: Response) {
  try {
    const pidx = req.query.pidx as string | undefined;
    if (!pidx) {
      return res.status(400).json({ message: "Missing pidx" });
    }

    const result = await lookupKhaltiPayment(pidx);

    if (result.status === "Completed") {
      return res.status(200).json({ success: true, status: result.status, data: result });
    }

    return res.status(200).json({ success: false, status: result.status, data: result });
  } catch (err) {
    console.error("Khalti verify error:", err);
    return res.status(500).json({ message: "Failed to verify Khalti payment" });
  }
}