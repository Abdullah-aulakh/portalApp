import { Request, Response } from "express";
import { gradeRepository,courseRepository,studentRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { GradeResponseDto } from "../dto/response/grade.response.dto";


export class GradeController {
  
  static getAllGrades = catchAsync(async (req: Request, res: Response) => {
    const grades = await gradeRepository.find();
    res.status(200).json(grades.map((g) => new GradeResponseDto(g)));
  });
  static getGradeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const grade = await gradeRepository.findById(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.status(200).json(new GradeResponseDto(grade));
  });

  static deleteGradeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const grade = await gradeRepository.findById(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    await gradeRepository.delete(id);
    res.status(200).json({ message: "Grade deleted successfully" });
  });

  static updateGradeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const grade = await gradeRepository.findById(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    const updatedGrade = await gradeRepository.updateGrade(id, req.body);
    res.status(200).json(updatedGrade);
  });

  static createGrade = catchAsync(async (req: Request, res: Response) => {
    const student = await studentRepository.findById(req.body.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    req.body.student = student;

    const course = await courseRepository.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    req.body.course = course;
    const grade = await gradeRepository.createGrade(req.body);
    res.status(201).json(new GradeResponseDto(grade));
  });
}