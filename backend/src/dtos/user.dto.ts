import { z } from "zod";
import { UserSchema } from "../types/user.type";

// Register DTO — pick only what the client should send
export const RegisterUserDTO = UserSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
});
export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;

// Login DTO — only email + password
export const LoginUserDTO = UserSchema.pick({
    email: true,
    password: true,
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;
