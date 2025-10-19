import { Repository, DeepPartial } from "typeorm";
import { Enrollment } from "../entity/enrollment.entity";
import { BaseService } from "./base.service";

export class EnrollmentService extends BaseService<Enrollment> {
  constructor(repo: Repository<Enrollment>) {
    super(repo);
  }

  async enrollStudent(student: any, course: any) {
    const enroll = this.repo.create({ student, course, active: true } as DeepPartial<Enrollment>);
    await this.repo.save(enroll);
    return enroll;
  }

  async findByCourse(courseId: number) {
    return this.repo.find({ where: { course: { id: String(courseId) } }, relations: ["student", "student.user"] });
  }
}
