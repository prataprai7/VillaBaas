import mongoose, { Schema, Document } from "mongoose";
import { VillaType } from "../types/villa.type";

export interface IVilla extends VillaType, Document {
    _id: mongoose.Types.ObjectId;
    rating: number;
    reviews: number;
    img: string;
    additionalImages: string[];
    createdAt: Date;
    updatedAt: Date;
}

const VillaMongoSchema: Schema = new Schema<IVilla>(
    {
        name:              { type: String, required: true, trim: true },
        location:          { type: String, required: true, trim: true },
        address:           { type: String, required: true, trim: true },
        price:             { type: Number, required: true },
        rating:            { type: Number, default: 0 },
        reviews:           { type: Number, default: 0 },
        guests:            { type: Number, required: true },
        rooms:             { type: Number, required: true },
        baths:             { type: Number, required: true },
        tag:               { type: String, enum: ["popular", "new", "immediate"], default: "new" },
        type:              { type: String, required: true },
        img:               { type: String, required: true },
        additionalImages:  { type: [String], default: [] },
        amenities:         { type: [String], default: [] },
        breakfastIncluded: { type: Boolean, default: false },
        dinnerIncluded:    { type: Boolean, default: false },
        description:       { type: String, required: true },
        houseRules:        { type: [String], default: [] },
        isActive:          { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const VillaModel = mongoose.model<IVilla>("Villa", VillaMongoSchema);