import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../configs/constant";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/apihelper.util";

// Extend Express Request to carry the authenticated user
declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any> | IUser;
        }
    }
}

const userRepository = new UserMongoRepository();

export const authorizedMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            throw new HttpException(401, "Unauthorized — JWT missing or invalid");

        const token = authHeader.split(" ")[1]; // "Bearer <token>"
        if (!token) throw new HttpException(401, "Unauthorized — JWT token not found");

        const decoded = jwt.verify(token, SECRET_KEY) as Record<string, any>;
        if (!decoded || !decoded.id)
            throw new HttpException(401, "Unauthorized — JWT could not be verified");

        const user = await userRepository.getUserById(decoded.id);
        if (!user) throw new HttpException(401, "Unauthorized — user not found");

        req.user = user; // attach user to request for downstream use
        return next();
    } catch (err: any) {
        return ApiResponseHelper.error(
            res,
            err.message || "Internal Server Error",
            err.status || 500
        );
    }
};

export const adminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new HttpException(401, "Unauthorized — no user info");
        if ((req.user as IUser).role !== "admin")
            throw new HttpException(403, "Forbidden — admin access required");
        return next();
    } catch (err: any) {
        return ApiResponseHelper.error(
            res,
            err.message || "Internal Server Error",
            err.status || 500
        );
    }
};
