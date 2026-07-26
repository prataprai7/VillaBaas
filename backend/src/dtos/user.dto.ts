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

export const UpdateUserDTO = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

export const CreateUserDTOAdmin = UserSchema.pick({
    firstName: true,
    lastName:  true,
    email:     true,
    username:  true,
    password:  true,
    role:      true,
});
export type CreateUserDTOAdmin = z.infer<typeof CreateUserDTOAdmin>;

export const ForgotPasswordDTO = z.object({
    email: z.string().email("Invalid email"),
});
export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTO>;

export const ResetPasswordDTO = z
    .object({
        password: z.string().min(6, "Min 6 characters").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
        confirmPassword: z.string().min(1, "Required"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTO>;
