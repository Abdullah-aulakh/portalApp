import { Repository } from "typeorm";
import { Student } from "../entity/student.entity";

export class StudentService {
  constructor(private readonly studentRepository: Repository<Student>) {}

  async find(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: {
        user:true,
        department:true
      }
    });
  }

  async findById(id: string): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { id },
      relations: {
        user:true,
        department:true,
      }
    });
  }

 async findByRegistrationNumber(registrationNumber: string): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { registrationNumber },
    });
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.studentRepository.delete(id);
    return result.affected!==0;
  }
  async updateStudent(id: string, studentData: Partial<Student>): Promise<Student | null> {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) return null;
    this.studentRepository.merge(student, studentData);
    await this.studentRepository.save(student);
    return student;
  }
  async getTotal(): Promise<number> {
    return await this.studentRepository.count();
  }

}