import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import khaltiRoutes from "./routes/khalti.route";
import adminVillaRoutes from "./routes/villa.route";
import publicVillaRoutes from "./routes/public-villa.route";

const app: Application = express();


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const isLocalNetwork =
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
        /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
        /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/.test(origin);

      if (isLocalNetwork) return callback(null, true);

      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/auth",            userRoutes);
app.use("/api/v1/admin/users",     adminUserRoutes);
app.use("/api/v1/payments/khalti", khaltiRoutes);
app.use("/api/v1/admin/villas",    adminVillaRoutes);
app.use("/api/v1/villas",          publicVillaRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "API not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }
  return ApiResponseHelper.error(
    res,
    err?.message || "Internal Server Error",
    500
  );
});

export default app;