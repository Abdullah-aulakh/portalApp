import { Request, Response } from "express";
import { studentRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { StudentResponseDto } from "../dto/response/student.response.dto";

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
}