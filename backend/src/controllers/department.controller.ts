import { Request, Response } from "express";
import { departmentRepository, teacherRepository } from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { TeacherResponseDto } from "../dto/response/teacher.response.dto";
import { StudentResponseDto } from "../dto/response/student.response.dto";


export class DepartmentController {
  
  static getAllDepartments = catchAsync(async (req: Request, res: Response) => {
    const departments = await departmentRepository.find();
    res.status(200).json(departments);
  });

  static getDepartmentById = catchAsync(async (req: Request, res: Response) => {
    const department = await departmentRepository.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(department);
  });

  static createDepartment = catchAsync(async (req: Request, res: Response) => {
    if(req.body.headOfDepartmentId){
      const headOfDepartment = await teacherRepository.findById(req.body.headOfDepartmentId);
      if (!headOfDepartment) return res.status(404).json({ message: "Teacher not found" });
      req.body.headOfDepartment = headOfDepartment;
    }
    const existing = await departmentRepository.findByName(req.body.name);
    if(existing) return res.status(400).json({ message: "Department already exists" });
    const department = await departmentRepository.createDepartment(req.body);
    res.status(201).json(department);
  });


  static updateDepartment = catchAsync(async (req: Request, res: Response) => {

    const department = await departmentRepository.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    if(req.body.headOfDepartmentId){
      const headOfDepartment = await teacherRepository.findById(req.body.headOfDepartmentId);
      if (!headOfDepartment) return res.status(404).json({ message: "Teacher not found" });
      const HOD = await departmentRepository.findHOD(headOfDepartment.id);
      if(HOD) return res.status(400).json({ message: "Another deaprtement already has this teacher as head of department" });
      req.body.headOfDepartment = headOfDepartment;
    }
    const updatedDepartment = await departmentRepository.updateDepartment(req.params.id,req.body);
    res.status(200).json(updatedDepartment);
  });

  static deleteDepartment = catchAsync(async (req: Request, res: Response) => {
    const department = await departmentRepository.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    const deleted = await departmentRepository.delete(req.params.id);
    if(!deleted) return res.status(400).json({ message: "Department not deleted" });
    res.status(200).json({ message: "Department deleted successfully" });
  });
  static getDepartmentTeachers = catchAsync(async (req: Request, res: Response) => {
    const department = await departmentRepository.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    const teachers = await departmentRepository.findTeachers(req.params.id);
    res.status(200).json(teachers.map(t => new TeacherResponseDto(t)));
  });

  static getDepartmentStudents = catchAsync(async (req: Request, res: Response) => {
    const department = await departmentRepository.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    const students = await departmentRepository.findStudents(req.params.id);
    res.status(200).json(students.map(s => new StudentResponseDto(s)));
  });
}