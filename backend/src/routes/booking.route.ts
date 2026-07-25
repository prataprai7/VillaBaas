import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const bookingController = new BookingController();

// All booking routes require a logged-in user
router.use(authorizedMiddleware);

router.post("/",             bookingController.createBooking);
router.get("/my",            bookingController.getMyBookings);
router.get("/:id",           bookingController.getBookingById);
router.patch("/:id/pay",     bookingController.payBooking);
router.patch("/:id/cancel",  bookingController.cancelBooking);

export default router;