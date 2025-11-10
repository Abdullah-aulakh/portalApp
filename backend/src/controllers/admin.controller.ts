import { Request, Response } from "express";
import { catchAsync } from "../helpers/catch-async.helper";
import { studentRepository,teacherRepository,departmentRepository } from "../repository";

export class AdminController {
  
  static getDashboard = catchAsync(async (req: Request, res: Response) => {
   const totalStudents = await studentRepository.getTotal();
   const totalTeachers = await teacherRepository.getTotal();
   const totalDepartments = await departmentRepository.getTotal();
   res.status(200).json({totalStudents,totalTeachers,totalDepartments });

  });
}