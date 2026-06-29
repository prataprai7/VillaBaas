import { UserService } from "../../services/user.service";
import { z } from "zod";
import { CreateUserDTOAdmin, UpdateUserDTO } from "../../dtos/user.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const parsed = CreateUserDTOAdmin.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const user = await userService.createUser(parsed.data);
            return ApiResponseHelper.success(res, user, "User created successfully", 201);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const parsed = UpdateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            if (req.file) {
                parsed.data.profileImage = "/uploads/" + req.file.filename;
            }
            const updatedUser = await userService.updateUser(userId, parsed.data);
            return ApiResponseHelper.success(res, updatedUser, "User updated successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId);
            return ApiResponseHelper.success(res, null, "User deleted successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            return ApiResponseHelper.success(res, user, "User retrieved successfully");
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getAllUserPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await userService.getAllUserPaginated(page, limit, search);
            return ApiResponseHelper.success(res, data, "Users retrieved successfully", 200, pagination);
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}
