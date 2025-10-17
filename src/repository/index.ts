import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user.entity";
import { UserService } from "../service/user.service";
export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);

