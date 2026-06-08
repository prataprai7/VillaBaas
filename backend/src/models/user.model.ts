import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.types";
export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserMongoSchema: Schema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName:  { type: String, required: true },
        email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
        password:  { type: String, required: true },
        role:      { type: String, enum: ["admin", "user"], default: "user" },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// Remove password from JSON responses
UserMongoSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UserModel = mongoose.model<IUser>("User", UserMongoSchema);
