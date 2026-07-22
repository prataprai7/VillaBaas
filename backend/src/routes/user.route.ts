import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { BookingController } from "../controllers/booking.controller";

const userRouter = Router();
const userController = new UserController();
const bookingController = new BookingController();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login",    userController.loginUser);

userRouter.get("/whoami",
    authorizedMiddleware,
    userController.whoami
);

userRouter.put("/update",
    authorizedMiddleware,
    uploads.single("profileImage"),
    userController.updateUser
);


userRouter.post("/profile-picture",
    authorizedMiddleware,
    uploads.single("profileImage"),
    userController.uploadProfilePicture
);


userRouter.post("/bookings",
    authorizedMiddleware,
    bookingController.createBooking
);

userRouter.get("/bookings/my",
    authorizedMiddleware,
    bookingController.getMyBookings
);

// NEW: single-booking fetch, used by the payment success page
userRouter.get("/bookings/:id",
    authorizedMiddleware,
    bookingController.getBookingById
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