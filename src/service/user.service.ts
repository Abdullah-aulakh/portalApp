import { Repository } from "typeorm";
import { User } from "../entity/user.entity";

export class UserService {
    constructor(private readonly userRepository: Repository<User>) { }

    async find(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne(
            {
                where: { id },
                relations: ["student", "teacher", "admin"],
            }
        );
    }

    async createUser(user: User): Promise<User> {
        const newUser = this.userRepository.create(user);
        await this.userRepository.save(newUser);
        return newUser;
    }
    async delete(id: string): Promise<Boolean> {
        const result = await this.userRepository.delete(id);
        return result.affected!==0;
    }
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne(
            {
                where: { email },
                relations: ["student", "teacher", "admin"],
            }
        );
    }
     async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    this.userRepository.merge(user, userData);
    await this.userRepository.save(user);
    return user;
  }
}
