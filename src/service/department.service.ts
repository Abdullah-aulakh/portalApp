import { Repository } from "typeorm";
import { Department } from "../entity/department.entity";
import { Teacher } from "../entity/teacher.entity";

export class DepartmentService {
    constructor(private readonly departmentRepository: Repository<Department>) { }

    async find(): Promise<Department[]> {
        return await this.departmentRepository.find();
    }

   async findById(id: string): Promise<Department | null> {
  return await this.departmentRepository
    .createQueryBuilder('department')
    .leftJoinAndSelect('department.headOfDepartment', 'teacher')
    .leftJoinAndSelect('teacher.user', 'user')
    .where('department.id = :id', { id })
    .select([
      'department.id',
      'department.name',
      'teacher.id',
      'user.id',
      'user.firstName',
      'user.lastName',
      'user.email',
    ])
    .getOne();
}

    async createDepartment(department: Department): Promise<Department> {
        const newDepartment = this.departmentRepository.create(department);
        await this.departmentRepository.save(newDepartment);
        return newDepartment;
    }
    async updateDepartment(id: string, departmentData: Partial<Department>): Promise<Partial<Department>> {
       const department = await this.departmentRepository.findOne({
         where: { id },
       });
       console.log(department);
       if (!department) {
         throw new Error('Department not found');
       }

       this.departmentRepository.merge(department, departmentData);
       await this.departmentRepository.save(department,);
       console.log(department);
       return {
         id: department.id,
         name: department.name,

       }
    }
   async findHOD(id: string): Promise<Department | null> {
     return await this.departmentRepository.findOne({
       where: { headOfDepartment: { id } },
       relations: ["headOfDepartment"],
     });
    }
    async delete(id: string): Promise<Boolean> {
        const result = await this.departmentRepository.delete(id);
        return result.affected!==0;
    }
    async findTeachers(id: string): Promise<Teacher[]> {
       const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ["teachers"],
        });
        return department?.teachers ?? [];
    }
}