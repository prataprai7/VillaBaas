import { BookingMongoRepository } from "../repositories/booking.repository";
import { IBooking } from "../models/booking.model";
import { HttpException } from "../exceptions/http-exception";

const bookingRepository = new BookingMongoRepository();

export class BookingService {
    async createBooking(userId: string, data: Partial<IBooking>): Promise<IBooking> {
        const checkIn  = new Date(data.checkIn!);
        const checkOut = new Date(data.checkOut!);
        const nights   = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (nights <= 0) throw new HttpException(400, "Check-out must be after check-in");

        const totalPrice = (data.pricePerNight ?? 0) * nights;

        return bookingRepository.create({
            ...data,
            userId:     userId as any,
            nights,
            totalPrice,
            status:     "unpaid",
        });
    }

    async getUserBookings(userId: string): Promise<IBooking[]> {
        return bookingRepository.findByUser(userId);
    }

    async payBooking(bookingId: string, userId: string, paymentMethod: string): Promise<IBooking> {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new HttpException(404, "Booking not found");
        if (booking.userId.toString() !== userId)
            throw new HttpException(403, "Forbidden — not your booking");
        if (booking.status === "cancelled")
            throw new HttpException(400, "Cannot pay a cancelled booking");

        const updated = await bookingRepository.updateStatus(bookingId, "paid", paymentMethod);
        return updated!;
    }

    async cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new HttpException(404, "Booking not found");
        if (booking.userId.toString() !== userId)
            throw new HttpException(403, "Forbidden — not your booking");
        if (booking.status === "paid")
            throw new HttpException(400, "Cannot cancel a paid booking");

        const updated = await bookingRepository.updateStatus(bookingId, "cancelled");
        return updated!;
    }
}