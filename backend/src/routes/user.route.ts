import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { BookingController } from "../controllers/booking.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();
const bookingController = new BookingController();

// ── Auth routes (public) ──────────────────────────────────────────────────────
userRouter.post("/register", userController.registerUser);
userRouter.post("/login",    userController.loginUser);

// ── User routes (protected) ───────────────────────────────────────────────────
userRouter.get("/whoami",
  authorizedMiddleware,
  userController.whoami
);

userRouter.put("/update",
  authorizedMiddleware,
  uploads.single("profileImage"),
  userController.updateUser
);

// Profile picture upload — used by Flutter mobile
// POST /api/v1/auth/profile-picture
// Header: Authorization: Bearer <token>
// Body: multipart/form-data with field "profileImage"
userRouter.post("/profile-picture",
  authorizedMiddleware,
  uploads.single("profileImage"),
  userController.uploadProfilePicture
);

// ── Booking routes (protected, used by mobile) ────────────────────────────────
// POST   /api/v1/auth/bookings        → create booking
// GET    /api/v1/auth/bookings/my     → get logged-in user's bookings
// PATCH  /api/v1/auth/bookings/:id/pay    → mark as paid
// PATCH  /api/v1/auth/bookings/:id/cancel → cancel booking
userRouter.post("/bookings",
  authorizedMiddleware,
  bookingController.createBooking
);

userRouter.get("/bookings/my",
  authorizedMiddleware,
  bookingController.getMyBookings
);

userRouter.patch("/bookings/:id/pay",
  authorizedMiddleware,
  bookingController.payBooking
);

userRouter.patch("/bookings/:id/cancel",
  authorizedMiddleware,
  bookingController.cancelBooking
);

export default userRouter;