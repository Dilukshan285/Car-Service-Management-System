import { Router } from "express";
import UserController from "../controller/User.js"; // Import the default export as UserController

const router = Router();

router.post("/signup", UserController.signup);
router.post("/verify", UserController.verifyUser);
router.post("/resend/otp", UserController.resendOtp);
router.post("/signin", UserController.signin);
router.post("/google", UserController.google);
router.post("/requestOtp", UserController.requestOtp);
router.post("/verifyOtp", UserController.verifyOtpForPasswordReset);
router.post("/recovery/otp", UserController.recovery_resendOTP);
router.put("/resetPassword", UserController.resetPassword);

export default router;