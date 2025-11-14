import { Request, Response } from "express";
import { studentRepository,enrollmentRepository, attendanceRepository, timetableRepository,courseRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { StudentResponseDto } from "../dto/response/student.response.dto";
import { getDay } from "../helpers/date-time.helper";

export class StudentController {
  
  static getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const students = await studentRepository.find();
    res.status(200).json(students.map(s => new StudentResponseDto(s)));
  });
  static getStudentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  });

  static deleteStudentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await studentRepository.delete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  });

  static updateStudentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const updatedStudent = await studentRepository.updateStudent(id, req.body);
    res.status(200).json(updatedStudent);
  });

  static getStudentByRegistrationNumber = catchAsync(async (req: Request, res: Response) => {
    const { registrationNumber } = req.params;
    const student = await studentRepository.findByRegistrationNumber(registrationNumber);
    if (!student) return res.status(404).json({ message: "Student not found" });
    console.log(student);
    res.status(200).json(new StudentResponseDto(student));
  });

 static getStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const student = await studentRepository.getStudentByUserId(id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const activeEnrollments = await enrollmentRepository.findActiveEnrollments(student.id);

  // Map over enrollments asynchronously
  const enrichedEnrollments = await Promise.all(
    activeEnrollments.map(async (enrollment) => {
      const {percentage} = await attendanceRepository.getStudentAttendancePercentage(
        student.id,
        enrollment.course.id
      );

      const todaysClasses = await timetableRepository.findByCourseAndDay(enrollment.course.id,getDay());

      return {
        ...enrollment,
        attendancePercentage: percentage,
        todaysClasses
      };
    })
  );

  res.status(200).json({
    ...student,
    activeEnrollments: enrichedEnrollments,
  });
});

  static getStudentTimeTable = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.getStudentByUserId(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

     const activeEnrollments = await enrollmentRepository.findActiveEnrollments(student.id);
     const courseIds = activeEnrollments.map(enrollment => enrollment.course.id);

     const timetables = await Promise.all(
      courseIds.map(async (courseId) => {
        const course = await courseRepository.findById(courseId);
        const todaysClasses = await timetableRepository.findByCourse(courseId);
        return {
          ...course,
          todaysClasses
        };
      })
    );
    res.status(200).json(timetables);
  });

  static getStudentAttendanceData = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.getStudentByUserId(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const activeEnrollments = await enrollmentRepository.findActiveEnrollments(student.id);
    const courseIds = activeEnrollments.map(enrollment => enrollment.course.id);

    const attendanceData = await Promise.all(
      courseIds.map(async (courseId) => {
        const course = await courseRepository.findById(courseId);
        const {percentage,total,present} = await attendanceRepository.getStudentAttendancePercentage(
          student.id,
          courseId
        );
        const records = await attendanceRepository.findByCourse(courseId);
        return {
          ...course,
          attendancePercentage: percentage,
          totalClasses: total,
          attendedClasses: present,
          records
        };
      })
    );
    res.status(200).json(attendanceData);
  });
}