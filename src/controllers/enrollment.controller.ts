import { Request, Response } from "express";
import { enrollmentRepository ,studentRepository,courseRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { EnrollmentResponseDto } from "../dto/response/enrollment.response.dto";

export class EnrollmentController {
  
  static getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
    const enrollments = await enrollmentRepository.find();
    res.status(200).json(enrollments.map(e => new EnrollmentResponseDto(e)));
  });
  static getEnrollmentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json(new EnrollmentResponseDto(enrollment));
  });

  static deleteEnrollmentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    await enrollmentRepository.delete(id);
    res.status(200).json({ message: "Enrollment deleted successfully" });
  });

  static updateEnrollmentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const enrollment = await enrollmentRepository.findById(id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    const updatedEnrollment = await enrollmentRepository.updateEnrollment(id, req.body);
    res.status(200).json(new EnrollmentResponseDto(updatedEnrollment));
  });

  static createEnrollment = catchAsync(async (req: Request, res: Response) => {
    const isAlreadyExists = await enrollmentRepository.findExistingEnrollment(req.body.studentId, req.body.courseId);
    if (isAlreadyExists)
      return res.status(400).json({ message: "Student already enrolled in this course" });
    const course = await courseRepository.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    req.body.course = course;
    const student = await studentRepository.findById(req.body.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    req.body.student = student;
    const enrollment = await enrollmentRepository.createEnrollment(req.body);
    res.status(201).json(new EnrollmentResponseDto(enrollment));
  });
}