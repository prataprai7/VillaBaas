import { z } from "zod";
import { UserSchema } from "../types/user.type";

export const RegisterUserDTO = UserSchema.pick({
    firstName: true,
    lastName:  true,
    email:     true,
    password:  true,
});
export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;

export const LoginUserDTO = UserSchema.pick({
    email:    true,
    password: true,
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// All fields optional for partial update
export const UpdateUserDTO = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
