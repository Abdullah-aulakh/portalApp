import { AppDataSource } from "../config/data-source";
import { User, Teacher, Department, Student, Token, Otp,Timetable } from "../entity/index";
import { UserService , TeacherService, DepartmentService, StudentService,TokenService, OtpService,TimetableService } from "../service/index";
export const teacherRepository = new TeacherService(
  AppDataSource.getRepository(Teacher)
);
export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);
export const departmentRepository = new DepartmentService(
  AppDataSource.getRepository(Department)
);
export const otpRepository = new OtpService(
  AppDataSource.getRepository(Otp)
);
export const tokenRepository = new TokenService(
  AppDataSource.getRepository(Token)
);
export const studentRepository = new StudentService(
  AppDataSource.getRepository(Student)

);
export const timetableRepository = new TimetableService(
  AppDataSource.getRepository(Timetable)  
);
export const gradeRepository = new GradeService(
  AppDataSource.getRepository(Grade)
);