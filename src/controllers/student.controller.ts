import { Request, Response } from "express";
import { studentRepository,enrollmentRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { StudentResponseDto } from "../dto/response/student.response.dto";
import { EnrollmentResponseDto } from "../dto/response/enrollment.response.dto";


export class StudentController {
  
  static getAllStudents = catchAsync(async (req: Request, res: Response) => {
    const students = await studentRepository.find();
    res.status(200).json(students.map(s => new StudentResponseDto(s)));
  });
  static getStudentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(new StudentResponseDto(student));
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
  static getStudentEnrollments = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentRepository.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    const enrollments = await enrollmentRepository.findByStudentId(id);
    res.status(200).json(enrollments?.map(e => new EnrollmentResponseDto(e)));
  });
}