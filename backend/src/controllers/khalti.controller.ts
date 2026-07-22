import { Request, Response } from "express";
import { initiateKhaltiPayment, lookupKhaltiPayment } from "../services/khalti.service";
import { BookingService } from "../services/booking.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const bookingService = new BookingService();

export class KhaltiController {
    /**
     * POST /api/v1/payments/khalti/initiate
     * body: { bookingId }
     * The booking must already exist (status "unpaid") — created via your
     * normal POST /bookings endpoint before this is ever called.
     * Uses the booking's real totalPrice from MongoDB, never a client value.
     */
    async initiate(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id.toString();
            const { bookingId } = req.body as { bookingId?: string };
            if (!bookingId) return ApiResponseHelper.error(res, "bookingId is required", 400);

            const booking = await bookingService.getBookingById(bookingId, userId);
            if (booking.status !== "unpaid") {
                return ApiResponseHelper.error(res, "This booking is not payable", 400);
            }

            const user = req.user as any;
            const result = await initiateKhaltiPayment({
                amountNPR: booking.totalPrice,
                purchaseOrderId: booking._id.toString(),
                purchaseOrderName: `${booking.villaName} booking`,
                customerInfo: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    // Khalti sandbox needs a 10-digit number; swap in a real profile field once you collect one.
                    phone: user.phone || "9800000000",
                },
            });

            return ApiResponseHelper.success(res, result, "Khalti payment initiated");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    /**
     * GET /api/v1/payments/khalti/verify?pidx=...&bookingId=...
     * Called by the frontend after Khalti redirects the user back.
     * Confirms the real status AND amount with Khalti before marking paid.
     */
    async verify(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id.toString();
            const { pidx, bookingId } = req.query as { pidx?: string; bookingId?: string };

            if (!pidx || !bookingId) {
                return ApiResponseHelper.error(res, "pidx and bookingId are required", 400);
            }

            const lookup = await lookupKhaltiPayment(pidx);

            if (lookup.status !== "Completed") {
                return ApiResponseHelper.success(
                    res,
                    { status: lookup.status },
                    "Payment not completed",
                    200
                );
            }

            const paidAmountNPR = lookup.total_amount / 100;
            const booking = await bookingService.verifyAndPayBooking(
                bookingId,
                userId,
                "khalti",
                paidAmountNPR
            );

            return ApiResponseHelper.success(res, booking, "Payment verified and booking paid");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}