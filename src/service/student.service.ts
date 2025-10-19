import { Repository } from "typeorm";
import { Student } from "../entity/student.entity";

export class StudentService {
  constructor(private readonly studentRepository: Repository<Student>) {}

  async find(): Promise<Student[]> {
    return await this.studentRepository.find();
  }

  async findById(id: string): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { id },
    });
  }

 async findByRegistrationNumber(registrationNumber: string): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { registrationNumber },
    });
  }

}