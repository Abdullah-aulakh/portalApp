import { Repository } from "typeorm";
import { Department } from "../entity/department.entity";
import { Teacher } from "../entity/teacher.entity";
import { Student } from "../entity/student.entity";
import { Course } from "../entity/course.entity";

export class DepartmentService {
  constructor(private readonly departmentRepository: Repository<Department>) {}

  async find(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations:{
        teachers:true,
        students:true,
        headOfDepartment:{
          user:true,
        }
      }
    });
  }

  async findById(id: string): Promise<Department | null> {
    return await this.departmentRepository.findOne({
      where: { id },
    });
  }

  async createDepartment(department: Department): Promise<Department> {
    const newDepartment = this.departmentRepository.create(department);
    await this.departmentRepository.save(newDepartment);
    return newDepartment;
  }
  async updateDepartment(
    id: string,
    departmentData: Partial<Department>
  ): Promise<Partial<Department>> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    console.log(department);
    if (!department) {
      throw new Error("Department not found");
    }

    this.departmentRepository.merge(department, departmentData);
    await this.departmentRepository.save(department);
    console.log(department);
    return {
      id: department.id,
      name: department.name,
    };
  }
  async findHOD(id: string): Promise<Department | null> {
    return await this.departmentRepository.findOne({
      where: { headOfDepartment: { id } },
      relations: ["headOfDepartment"],
    });
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.departmentRepository.delete(id);
    return result.affected !== 0;
  }
  async findTeachers(id: string): Promise<Teacher[]> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: {
        teachers:{
          user:true,
          department:true
        }
      }
    });
    return department?.teachers ?? [];
  }
  async findStudents(id: string): Promise<Student[]> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: {
        students:{
          user:true,
          department:true
        }
      }
    });
   
    return department?.students ?? [];
  }
   async findByName(name:string):Promise<Department|null>{
      return await this.departmentRepository.findOne({
        where: { name },
      });
    }
    async getTotal(): Promise<number> {
      return await this.departmentRepository.count();
    }

    async findCourses(id: string): Promise<Course[]> {
      const department = await this.departmentRepository.findOne({
        where: { id },
        relations: {
          courses:{
            enrollments:true,
            department:true,
            teacher:{
              user:true
            }
          }
        }
      });
     
      return department?.courses ?? [];
    }
}
