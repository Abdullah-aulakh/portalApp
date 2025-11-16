import { Repository } from "typeorm";
import { Admin } from "../entity/admin.entity";

export class AdminService {
  constructor(private readonly adminRepository: Repository<Admin>) {}

  async find(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findById(id: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { id },
    });
  }

  async createAdmin(admin: Admin): Promise<Admin> {
    const newAdmin = this.adminRepository.create(admin);
    await this.adminRepository.save(newAdmin);
    return newAdmin;
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.adminRepository.delete(id);
    return result.affected !== 0;
  }
  async updateAdmin(id: string, adminData: Partial<Admin>): Promise<Admin | null> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) return null;

    this.adminRepository.merge(admin, adminData);
    await this.adminRepository.save(admin);
    return admin;
  }
}