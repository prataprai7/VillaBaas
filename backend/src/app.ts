import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";

const app: Application = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/auth",         userRoutes);
app.use("/api/v1/admin/users",  adminUserRoutes);

app.use((req: Request, res: Response) => {
    return res.status(404).json({ message: "API not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    if (err instanceof HttpException) {
        return ApiResponseHelper.error(res, err.message, err.status);
    }
    return ApiResponseHelper.error(res, err?.message || "Internal Server Error", 500);
});

export default app;
