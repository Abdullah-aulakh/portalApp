import { Request, Response } from "express";
import { tokenRepository, userRepository} from "../repository/index";
import Encrypt from "../helpers/encrypt.helper";
import { UserResponseDto } from "../dto/response/user.response.dto";
import { catchAsync } from "../helpers/catch-async.helper";
import { UserRoles } from "../enum/user.roles";
import { departmentRepository,otpRepository ,studentRepository} from "../repository/index";
import { User } from "../entity/user.entity";
import { Token } from "../entity/token.entity";
import { generateDbTokens } from "../helpers/dbTokens.helper";
export class AuthController {
  
  static loginUser = catchAsync(async (req: Request, res: Response) => {
    console.log(req.headers);
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await Encrypt.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = await Encrypt.generateToken({ id: user.id });
    const refreshToken = await Encrypt.generateRefreshToken({ id: user.id });
    await generateDbTokens(user, token, refreshToken);

    // Set access token cookie (short lived)
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    // Set refresh token cookie (longer lived)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Send only user info in body. Tokens are in cookies.
    res.status(200).json({
      user: new UserResponseDto(user),
    });
  });

  static refreshToken = catchAsync(async (req: Request, res: Response) => {
    // Read refresh token from cookie instead of request body
    const refreshToken = (req as any).cookies?.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token cookie is required" });

    const dbExistance = await tokenRepository.findOne(refreshToken);
    if (!dbExistance) return res.status(401).json({ message: "unauthorized" });

    const payload = await Encrypt.verifyToken(refreshToken);
    const newToken = await Encrypt.generateToken({ id: payload.id });
    const newRefreshToken = await Encrypt.generateRefreshToken({ id: payload.id });
    await generateDbTokens(payload, newToken, newRefreshToken);

    // Update cookies with new tokens
    res.cookie("accessToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Return a minimal success response; tokens are in cookies
    res.status(200).json({ message: "tokens refreshed" });
  });

 
  static resetPassword = catchAsync(async (req: Request, res: Response) => {
   const {token,password} = req.body;
    const payload = await Encrypt.verifyToken(token);
    const dbToken = await tokenRepository.findOne(token);
    if (!dbToken) return res.status(401).json({ message: "unauthorized" });
    if (!payload) return res.status(401).json({ message: "unauthorized" });
    const user = await userRepository.findByEmail(payload.email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await otpRepository.findOne(payload.otp, payload.email);
    if (!otpRecord) return res.status(404).json({ message: "Invalid OTP" });
    if(!otpRecord.verified)
      return res.status(400).json({ message: "Invalid OTP" });
    user.password = await Encrypt.hashPassword(password);
    await userRepository.updateUser(user.id, user);
    await tokenRepository.deleteAll(user.id);
    res.status(200).json({ message: "Password reset successfully" });
  });

  static createUser = catchAsync(async (req: Request, res: Response) => {
    const existingUser = await userRepository.findByEmail(req.body.email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    let userData = new User();
      userData= {...req.body};

    if(req.body?.role === UserRoles.TEACHER || req.body?.role === UserRoles.STUDENT){
      const department = await departmentRepository.findById(req.body.departmentId);
      if (!department) return res.status(404).json({ message: "Department not found" });
     if(userData.role === UserRoles.TEACHER){
      userData.teacher = {
        ...userData.teacher,
        department: department,
      };
     }
     else{
      const student = await studentRepository.findByRegistrationNumber(req.body.student.registrationNumber);
      if(student) return res.status(400).json({ message: "Student already exists" });
      userData.student = {
        ...userData.student,
        department: department,
      };
     }
    }
    
    const user = await userRepository.createUser(userData);
    res.status(201).json(new UserResponseDto(user));
    
  });

  static logoutUser = catchAsync(async (req: Request, res: Response) => {
    const user = req.headers["user"] as any;
    await tokenRepository.deleteAll(user.id);
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
  });
}
