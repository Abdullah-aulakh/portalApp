// src/controllers/otp.controller.ts
import { Request, Response } from "express";
import { otpRepository,tokenRepository, userRepository} from "../repository";
import NodemailerHelper from "../helpers/nodemailer.helper";
import { generateOtp } from "../helpers/otp.helper";
import { catchAsync } from "../helpers/catch-async.helper";
import Encrypt from "../helpers/encrypt.helper";
import { Token } from "../entity/token.entity";


export class OtpController {
 
    static generate = catchAsync(async (req: Request, res: Response) => {
       const { email ,message} = req.body;
    const otp = generateOtp();

     await otpRepository.createOtp({ email, otp });
    await NodemailerHelper.sendEmail(email, "Your OTP Code", `<p>Your OTP code is: <b>${otp}</b></p><p>${message}</p>`);

    res.status(201).json({ message: "OTP sent"});
    });

    static verify = catchAsync(async (req: Request, res: Response) => {
        console.log("Verify OTP called with body:", req.body);
        const { otp, email } = req.body;
        const otpRecord = await otpRepository.findOne(otp, email);
        console.log("Fetched OTP record:", otpRecord);
        if (!otpRecord) return res.status(404).json({ message: "Invalid OTP" });
        if (otpRecord.verified || otpRecord.expiresAt < new Date())
            return res.status(400).json({ message: "Invalid OTP" });

        const user = await userRepository.findByEmail(email);
        console.log("Associated user:", user);
        if (!user) return res.status(404).json({ message: "User not found" });

        otpRecord.verified = true;
        await otpRepository.update(otpRecord.id, otpRecord);
        const token = await Encrypt.generateToken({ email,otp },"5m");
        const dbToken = new Token();
        dbToken.token = token;
        dbToken.user = user;
        dbToken.expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5);
        await tokenRepository.createToken(dbToken);


        res.status(200).json({ message: "OTP verified successfully" ,token});
    });


  
}
