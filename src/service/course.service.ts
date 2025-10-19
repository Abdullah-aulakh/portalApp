import { Repository } from "typeorm";
  import { Course } from "../entity/course.entity";

  export class CourseService {
    constructor(private readonly courseRepository: Repository<Course>) {}

    async findAll(): Promise<Course[]> {
      return await this.courseRepository.find();
    }
    async findById(id: string): Promise<Course | null> {
      return await this.courseRepository.findOne({
        where: { id },
      });
    }
    async createCourse(course: Course): Promise<Course> {
      const newCourse = this.courseRepository.create(course);
      await this.courseRepository.save(newCourse);
      return newCourse;
    }
    async delete(id: string): Promise<Boolean> {
      const result = await this.courseRepository.delete(id);
      return result.affected !== 0;
    }
    async updateCourse(id: string, courseData: Partial<Course>): Promise<Course | null> {
      const course = await this.courseRepository.findOneBy({ id });
      if (!course) return null;
      this.courseRepository.merge(course, courseData);
      await this.courseRepository.save(course);
      return course;
    }
    async findByCode(code: string): Promise<Course | null> {
      return await this.courseRepository.findOne({
        where: { code },
      });
    }
}