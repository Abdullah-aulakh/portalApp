import { Request, Response } from "express";
import { userRepository} from "../repository/index";
import Encrypt from "../helpers/encrypt.helper";
import { UserResponseDto } from "../dto/response/user.response.dto";
import { catchAsync } from "../helpers/catch-async.helper";

export class UserController {
  
  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userRepository.find();
    res.status(200).json(users);
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userResponseDto = new UserResponseDto(user);
    res.status(200).json(userResponseDto);
  });

  static deleteUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Admin cannot be deleted" });

    await userRepository.delete(id);
    res.status(200).json({ message: "User deleted successfully" });
  });
}