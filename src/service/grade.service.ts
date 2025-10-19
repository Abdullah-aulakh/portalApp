import { Repository } from "typeorm";
import { Grade } from "../entity/grade.entity";

export class GradeService {
  constructor(private readonly gradeRepository: Repository<Grade>) {}

  async find(): Promise<Grade[]> {
    return await this.gradeRepository.find({
      relations: {
        student: {
          user: true,
        },
        course: true,
      },
    });
  }

  async findById(id: string): Promise<Grade | null> {
    return await this.gradeRepository.findOne({
      where: { id },
      relations: {
        student: {
          user: true,
        },
        course: true,
      },
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
  async updateGrade(id: string, gradeData: Partial<Grade>): Promise<Grade | null> {
    const grade = await this.gradeRepository.findOneBy({ id });
    if (!grade) return null;

    this.gradeRepository.merge(grade, gradeData);
    await this.gradeRepository.save(grade);
    return grade;
  }
}