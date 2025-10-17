import { Request, Response } from "express";
import { userRepository} from "../repository/index";
import Encrypt from "../helpers/encrypt.helper";
import { UserResponseDto } from "../dto/response/user.response.dto";
import { catchAsync } from "../helpers/catch-async.helper";

export class AuthController {
  
  static loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await Encrypt.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = await Encrypt.generateToken({ id: user.id });
    const refreshToken = await Encrypt.generateRefreshToken({ id: user.id });

    res.status(200).json({
      user: new UserResponseDto(user),
      token,
      refreshToken,
    });
  });

  static refreshToken = catchAsync(async (req: Request, res: Response) => { 
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token is required" });

    const payload = await Encrypt.verifyToken(refreshToken);
    const newToken = await Encrypt.generateToken({ id: payload.id });
    const newRefreshToken = await Encrypt.generateRefreshToken({ id: payload.id });

    res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  });

 
  // static resetPassword = catchAsync(async (req: Request, res: Response) => {
  //   const { email, password, otp } = req.body;
  //   const user = await userRepository.findByEmail(email);
  //   if (!user) return res.status(404).json({ message: "User not found" });

  //   const otpRecord = await otpRepository.findOne(otp, email);
  //   if (!otpRecord) return res.status(404).json({ message: "Invalid OTP" });
  //   if (otpRecord.verified || otpRecord.expiresAt < new Date())
  //     return res.status(400).json({ message: "Invalid OTP" });

  //   user.password = await Encrypt.hashPassword(password);
  //   await userRepository.updateUser(user.id, user);

  //   otpRecord.verified = true;
  //   await otpRepository.update(otpRecord.id, otpRecord);

  //   res.status(200).json({ message: "Password reset successfully" });
  // });

  static createUser = catchAsync(async (req: Request, res: Response) => {
    const existingUser = await userRepository.findByEmail(req.body.email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const user = await userRepository.createUser(req.body);
    res.status(201).json(new UserResponseDto(user));
  });
}
