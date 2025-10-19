import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user.entity";
import { Student } from "../entity/student.entity";
import { Teacher } from "../entity/teacher.entity";
import { Course } from "../entity/course.entity";
import { Enrollment } from "../entity/enrollment.entity";
import { CourseService } from "../services/course.service";
import { StudentService } from "../services/student.service";
import { TeacherService } from "../services/teacher.service";
import { EnrollmentService } from "../services/enrollment.service";

export const userRepository = AppDataSource.getRepository(User);
export const studentRepository = new StudentService(AppDataSource.getRepository(Student));
export const teacherRepository = new TeacherService(AppDataSource.getRepository(Teacher));
export const courseRepository = new CourseService(AppDataSource.getRepository(Course));
export const enrollmentRepository = new EnrollmentService(AppDataSource.getRepository(Enrollment));
