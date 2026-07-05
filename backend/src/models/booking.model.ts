import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    villaName: string;
    villaType: string;
    location: string;
    image: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    pricePerNight: number;
    totalPrice: number;
    nights: number;
    status: "paid" | "unpaid" | "cancelled" | "completed";
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
    {
        userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
        villaName:     { type: String, required: true },
        villaType:     { type: String, required: true },
        location:      { type: String, required: true },
        image:         { type: String, required: true },
        checkIn:       { type: Date,   required: true },
        checkOut:      { type: Date,   required: true },
        guests:        { type: Number, required: true },
        pricePerNight: { type: Number, required: true },
        totalPrice:    { type: Number, required: true },
        nights:        { type: Number, required: true },
        status: {
            type:    String,
            enum:    ["paid", "unpaid", "cancelled", "completed"],
            default: "unpaid",
        },
        paymentMethod: { type: String, required: false },
    },
    { timestamps: true }
);

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);