import { Request, Response } from "express";
import { gradeRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";


export class GradeController {
  
  static getAllGrades = catchAsync(async (req: Request, res: Response) => {
    const grades = await gradeRepository.find();
    res.status(200).json(grades);
  });
  static getGradeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const grade = await gradeRepository.findById(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.status(200).json(grade);
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
    const grade = await gradeRepository.createGrade(req.body);
    res.status(201).json(grade);
  });
}