import { Router } from "express";
import { OtpController } from "../controllers/otp.controller";

const otpRouter = Router();
otpRouter.post("/generate", OtpController.generate);
otpRouter.post("/verify", OtpController.verify);

export { otpRouter };