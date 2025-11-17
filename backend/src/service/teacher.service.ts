import { Repository } from "typeorm";
import { Teacher } from "../entity/teacher.entity";
import { Course } from "../entity/course.entity";

export class TeacherService {
    constructor(private readonly teacherRepository: Repository<Teacher>) { }

    async find(): Promise<Teacher[]> {
        return await this.teacherRepository.find();
    }

    async findById(id: string): Promise<Teacher | null> {
        console.log(id);
        return await this.teacherRepository.findOne(
            {
                where: { id },
                relations: ["user"],
            }
        );
    }

    async createTeacher(teacher: Teacher): Promise<Teacher> {
        const newTeacher = this.teacherRepository.create(teacher);
        await this.teacherRepository.save(newTeacher);
        return newTeacher;
    }
    async delete(id: string): Promise<Boolean> {
        const result = await this.teacherRepository.delete(id);
        return result.affected!==0;
    }
   
    async updateTeacher(id: string, teacherData: Partial<Teacher>): Promise<Teacher | null> {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) return null;

    this.teacherRepository.merge(teacher, teacherData);
    await this.teacherRepository.save(teacher);
    return teacher;
  }
    async getTotal(): Promise<number> {
        return await this.teacherRepository.count();
    }
    async findCourses(id: string): Promise<Course[]> {
      const teacher = await this.teacherRepository.findOne({
        where: { id },
        relations: {
          courses:{
            department:true,
            timetable:true,
          
          }
        }
      });
     
      return teacher?.courses ?? [];
    }
    async findByUserId(id: string): Promise<Teacher | null> {
      return await this.teacherRepository.findOne({
        where: { user: { id } },
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
    }

}