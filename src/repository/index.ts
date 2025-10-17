import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user.entity";
import { UserService } from "../service/user.service";
import { OtpService } from "../service/otp.service";
import { Otp } from "../entity/otp.entity";

export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);

export const otpRepository = new OtpService(
  AppDataSource.getRepository(Otp)
);