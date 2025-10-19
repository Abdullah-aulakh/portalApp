import { Request, Response } from "express";
import { courseRepository, enrollmentRepository, studentRepository, teacherRepository, userRepository } from "../repository";
import { catchAsync } from "../middleware/authentication";
import { Course } from "../entity/course.entity";
import { AppDataSource } from "../config/data-source";


export class CourseController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const courses = await courseRepository.findAllWithRelations(skip, limit);
    res.json(courses);
  });

  static createCourse = catchAsync(async (req: Request, res: Response) => {
    const { title, description, code, teacherId } = req.body;
    let teacher = undefined;
    if (teacherId) {
      teacher = await teacherRepository.findById(Number(teacherId));
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    }

    // build a partial course object and cast safely to Course through unknown to satisfy TS
    const course = await courseRepository.create({
      title,
      description,
      code,
      teacher,
    } as unknown as Course);

    res.status(201).json(course);
  });

  static updateCourse = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = req.body;
    if (data.teacherId) {
      const t = await teacherRepository.findById(Number(data.teacherId));
      if (!t) return res.status(404).json({ message: "Teacher not found" });
      // @ts-ignore
      data.teacher = t;
    }
    const updated = await courseRepository.update(id, data);
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  });

  static deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const deleted = await courseRepository.delete(id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Deleted" });
  });

  // get courses by teacher id (teachers & admin)
  static getCoursesByTeacher = catchAsync(async (req: Request, res: Response) => {
    const teacherId = Number(req.params.teacherId);
    const courses = await courseRepository.findByTeacherId(teacherId);
    res.json(courses);
  });

  // Admin assigns a student to a course (creates enrollment)
  static assignStudentToCourse = catchAsync(async (req: Request, res: Response) => {
    const courseId = Number(req.params.courseId);
    const { studentId } = req.body;
    const student = await studentRepository.findById(Number(studentId));
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await courseRepository.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = await enrollmentRepository.enrollStudent(student, course);
    res.status(201).json(enrollment);
  });

  // Students view own enrolled courses
  static getMyEnrollments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // find student's profile by user id
    // userRepository is raw repo; studentRepository has findById which expects student id; so query student by user relation
    const student = await AppDataSource.getRepository("students").findOne({
      where: { user: { id: user.id } },
      relations: ["enrollments", "enrollments.course", "enrollments.course.teacher", "enrollments.course.teacher.user"],
    });

    if (!student) return res.status(404).json({ message: "Student profile not found" });
    res.json(student.enrollments);
  });
}
