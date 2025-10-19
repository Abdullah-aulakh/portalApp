import { Repository } from "typeorm";
import { Course } from "../entity/course.entity";
import { BaseService } from "./base.service";

export class CourseService extends BaseService<Course> {
  constructor(private courseRepo: Repository<Course>) {
    super(courseRepo);
  }

  async findAllWithRelations(skip = 0, take = 100) {
    return this.courseRepo.find({
      relations: ["teacher", "enrollments", "enrollments.student", "enrollments.student.user"],
      skip,
      take,
      order: ({ createdAt: "DESC" } as any),
    });
  }

  async findByTeacherId(teacherId: number) {
    return this.courseRepo.find({
      where: { teacher: { id: teacherId } },
      relations: ["teacher", "enrollments", "enrollments.student", "enrollments.student.user"],
    });
  }
}
