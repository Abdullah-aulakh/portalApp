import { Request, Response } from "express";
import { teacherRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { TeacherResponseDto } from "../dto/response/teacher.response.dto";
export class TeacherController {
  
  static getAllTeachers = catchAsync(async (req: Request, res: Response) => {
    const teachers = await teacherRepository.find();
    res.status(200).json(teachers.map(t => new TeacherResponseDto(t)));
  });
  static getTeacherById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(new TeacherResponseDto(teacher));
  });

  static deleteTeacherById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await teacherRepository.delete(id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  });

  static updateTeacherById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const updatedTeacher = await teacherRepository.updateTeacher(id, req.body);
    res.status(200).json(updatedTeacher);
  });
}