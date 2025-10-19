import { AppDataSource } from "../config/data-source";
import { Course } from "../entity/course.entity";
import { Enrollment } from "../entity/enrollment.entity";
import { Student } from "../entity/student.entity";

export class CourseRepository {
  private courseRepo = AppDataSource.getRepository(Course);
  private enrollmentRepo = AppDataSource.getRepository(Enrollment);
  private studentRepo = AppDataSource.getRepository(Student);

  async create(data: Partial<Course>) {
    const course = this.courseRepo.create(data);
    return await this.courseRepo.save(course);
  }

  async findAll() {
    return await this.courseRepo.find({ relations: ["teacher"] });
  }

  async findById(id: string) {
    return await this.courseRepo.findOne({ where: { id }, relations: ["teacher", "enrollments"] });
  }

  async update(id: string, data: Partial<Course>) {
    await this.courseRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    return await this.courseRepo.delete(id);
  }

  async addStudent(courseId: string, studentId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!course || !student) throw new Error("Course or student not found");

    const existingEnrollment = await this.enrollmentRepo.findOne({ where: { course, student } });
    if (existingEnrollment) throw new Error("Student already enrolled");

    const enrollment = this.enrollmentRepo.create({ course, student });
    return await this.enrollmentRepo.save(enrollment);
  }

  async findByStudent(studentId: string) {
    return await this.courseRepo
      .createQueryBuilder("course")
      .innerJoin("course.enrollments", "enrollment")
      .innerJoin("enrollment.student", "student")
      .where("student.id = :studentId", { studentId })
      .getMany();
  }
}
