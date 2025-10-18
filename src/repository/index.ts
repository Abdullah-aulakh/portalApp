import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user.entity";
import { UserService } from "../service/user.service";
import { Teacher } from "../entity/teacher.entity";
import {TeacherService} from "../service/teacher.service";
import { Department } from "../entity/department.entity";
import { DepartmentService } from "../service/department.service";
import { OtpService} from "../service/otp.service";
import { Otp } from "../entity/otp.entity";
import { TokenService} from "../service/token.service";
import { Token } from "../entity/token.entity";

export const teacherRepository = new TeacherService(
  AppDataSource.getRepository(Teacher)
);
export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);
export const departmentRepository = new DepartmentService(
  AppDataSource.getRepository(Department)
);
export const otpRepository = new OtpService(
  AppDataSource.getRepository(Otp)
);
export const tokenRepository = new TokenService(
  AppDataSource.getRepository(Token)
);