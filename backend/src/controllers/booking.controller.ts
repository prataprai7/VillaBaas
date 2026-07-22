import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const bookingService = new BookingService();

export class BookingController {
    async createBooking(req: Request, res: Response) {
        try {
            const userId  = (req.user as any)._id.toString();
            const booking = await bookingService.createBooking(userId, req.body);
            return ApiResponseHelper.success(res, booking, "Booking created successfully", 201);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyBookings(req: Request, res: Response) {
        try {
            const userId   = (req.user as any)._id.toString();
            const bookings = await bookingService.getUserBookings(userId);
            return ApiResponseHelper.success(res, bookings, "Bookings fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    // NEW: single-booking fetch, used by the success page after payment.
    async getBookingById(req: Request, res: Response) {
        try {
            const userId  = (req.user as any)._id.toString();
            const booking = await bookingService.getBookingById(req.params.id, userId);
            return ApiResponseHelper.success(res, booking, "Booking fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async payBooking(req: Request, res: Response) {
        try {
            const userId        = (req.user as any)._id.toString();
            const { paymentMethod } = req.body;
            if (!paymentMethod) return ApiResponseHelper.error(res, "paymentMethod is required", 400);

            const booking = await bookingService.payBooking(req.params.id, userId, paymentMethod);
            return ApiResponseHelper.success(res, booking, "Payment successful");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const userId  = (req.user as any)._id.toString();
            const booking = await bookingService.cancelBooking(req.params.id, userId);
            return ApiResponseHelper.success(res, booking, "Booking cancelled successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}