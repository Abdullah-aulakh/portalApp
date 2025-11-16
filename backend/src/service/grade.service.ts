import { Repository } from "typeorm";
import { Grade } from "../entity/grade.entity";

export class GradeService {
  constructor(private readonly gradeRepository: Repository<Grade>) {}

  async find(): Promise<Grade[]> {
    return await this.gradeRepository.find();
  }

  async findById(id: string): Promise<Grade | null> {
    return await this.gradeRepository.findOne({
      where: { id },
    });
  }

  async createGrade(grade: Grade): Promise<Grade> {
    const newGrade = this.gradeRepository.create(grade);
    await this.gradeRepository.save(newGrade);
    return newGrade;
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.gradeRepository.delete(id);
    return result.affected !== 0;
  }
  async updateGrade(records:any[]): Promise<void> {
    const formatted = records.map(r => ({
      ...r,
      student: { id: r.studentId },
      course: { id: r.courseId },
      
    }));
    console.log(formatted);
    await this.gradeRepository.save(formatted);

  }
  async findStudentGrades(courseId: string,studentId:string): Promise<Grade[]> {
    return await this.gradeRepository.find({
      where:{
        student:{id:studentId},
        course:{id:courseId}
      }
    });
  }
}