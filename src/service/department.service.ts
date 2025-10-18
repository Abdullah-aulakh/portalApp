import { Repository } from "typeorm";
import { Department } from "../entity/department.entity";

export class DepartmentService {
    constructor(private readonly departmentRepository: Repository<Department>) { }

    async find(): Promise<Department[]> {
        return await this.departmentRepository.find();
    }

    async findById(id: string): Promise<Department | null> {
        return await this.departmentRepository.findOne(
            {
                where: { id },
                relations: ["teachers"],
            }
        );
    }

    async createDepartment(department: Department): Promise<Department> {
        const newDepartment = this.departmentRepository.create(department);
        await this.departmentRepository.save(newDepartment);
        return newDepartment;
    }
}