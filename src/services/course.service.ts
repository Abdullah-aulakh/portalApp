import { CourseRepository } from "../repository/course.repository";

export class CourseService {
  private courseRepo = new CourseRepository();

  async createCourse(data: any) {
    return this.courseRepo.create(data);
  }

  async getAllCourses() {
    return this.courseRepo.findAll();
  }

  async getCourseById(id: string) {
    return this.courseRepo.findById(id);
  }

  async updateCourse(id: string, data: any) {
    return this.courseRepo.update(id, data);
  }

  async deleteCourse(id: string) {
    return this.courseRepo.delete(id);
  }

  async addStudentToCourse(courseId: string, studentId: string) {
    return this.courseRepo.addStudent(courseId, studentId);
  }

  async getStudentCourses(studentId: string) {
    return this.courseRepo.findByStudent(studentId);
  }
}
