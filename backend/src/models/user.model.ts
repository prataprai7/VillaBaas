import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserMongoSchema: Schema = new Schema<IUser>(
    {
        firstName:    { type: String, required: true },
        lastName:     { type: String, required: true },
        email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
        username:     { type: String, required: false, unique: true, sparse: true, trim: true },
        password:     { type: String, required: true },
        role:         { type: String, enum: ["admin", "user"], default: "user" },
        profileImage: { type: String, required: false },
        resetPasswordToken:   { type: String, required: false, select: false },
        resetPasswordExpires: { type: Date,   required: false, select: false },
    },
    { timestamps: true }
);

UserMongoSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UserModel = mongoose.model<IUser>("User", UserMongoSchema);
