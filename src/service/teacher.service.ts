import { Repository } from "typeorm";
import { Teacher } from "../entity/teacher.entity";

export class TeacherService {
    constructor(private readonly teacherRepository: Repository<Teacher>) { }

    async find(): Promise<Teacher[]> {
        return await this.teacherRepository.find();
    }

    async findById(id: string): Promise<Teacher | null> {
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
}