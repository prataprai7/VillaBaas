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
