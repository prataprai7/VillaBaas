import { BookingModel, IBooking } from "../models/booking.model";

export interface IBookingRepository {
    create(data: Partial<IBooking>): Promise<IBooking>;
    findByUser(userId: string): Promise<IBooking[]>;
    findById(id: string): Promise<IBooking | null>;
    updateStatus(id: string, status: IBooking["status"], paymentMethod?: string): Promise<IBooking | null>;
}

export class BookingMongoRepository implements IBookingRepository {
    async create(data: Partial<IBooking>): Promise<IBooking> {
        return BookingModel.create(data);
    }

    async findByUser(userId: string): Promise<IBooking[]> {
        return BookingModel.find({ userId }).sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IBooking | null> {
        return BookingModel.findById(id);
    }

    async updateStatus(
        id: string,
        status: IBooking["status"],
        paymentMethod?: string
    ): Promise<IBooking | null> {
        return BookingModel.findByIdAndUpdate(
            id,
            { status, ...(paymentMethod && { paymentMethod }) },
            { new: true }
        );
    }
}