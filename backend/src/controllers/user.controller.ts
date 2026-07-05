import { UserService } from "../services/user.service";
import { z } from "zod";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
    async registerUser(req: Request, res: Response) {
        try {
            const parsed = RegisterUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const user = await userService.registerUser(parsed.data);
            return ApiResponseHelper.success(res, user, "User registered successfully", 201);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const parsed = LoginUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const { user, token } = await userService.loginUser(parsed.data);
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async whoami(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) return ApiResponseHelper.error(res, "User not found", 404);
            return ApiResponseHelper.success(res, user, "User details fetched successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id;
            const parsed = UpdateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            if (req.file) {
                parsed.data.profileImage = "/uploads/" + req.file.filename;
            }
            const updatedUser = await userService.updateUser(userId, parsed.data);
            return ApiResponseHelper.success(res, updatedUser, "Profile updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }


    async uploadProfilePicture(req: Request, res: Response) {
        try {
            if (!req.file) {
                return ApiResponseHelper.error(res, "No file uploaded", 400);
            }
            const userId = (req.user as any)._id.toString();
            const profileImagePath = "/uploads/" + req.file.filename;

            await userService.updateUser(userId, {
                profileImage: profileImagePath,
            });

            return ApiResponseHelper.success(
                res,
                { profilePicture: profileImagePath },
                "Profile picture updated successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}