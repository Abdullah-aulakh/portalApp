import { Request, Response } from "express";
import { studentRepository, teacherRepository, userRepository,adminRepository,departmentRepository} from "../repository/index";

import { UserResponseDto } from "../dto/response/user.response.dto";
import { catchAsync } from "../helpers/catch-async.helper";


export class UserController {
  
  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userRepository.find();
    res.status(200).json(users);
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userResponseDto = new UserResponseDto(user);
    res.status(200).json(userResponseDto);
  });

  static deleteUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Admin cannot be deleted" });

    await userRepository.delete(id);
    res.status(200).json({ message: "User deleted successfully" });
  });
  static getUserProfile = catchAsync(async (req: Request, res: Response) => {
     const user = req.headers["user"] as any;
    const userData = await userRepository.findById(user.id);
    if (!userData) return res.status(404).json({ message: "User not found" });
    res.status(200).json(new UserResponseDto(userData));
  });
  static updateUserById = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const user = await userRepository.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "student") {
      const student = await studentRepository.findById(req.body.studentId);
      if (!student) return res.status(404).json({ message: "Student not found" });
      const department = await departmentRepository.findById(req.body.student.department.id);
      if (!department) return res.status(404).json({ message: "Department not found" });
      req.body.student.department = department;
      console.log(req.body.student);
      const updatedStudent = await studentRepository.updateStudent(req.body.studentId,req.body.student);
      console.log(updatedStudent);
      const updatedUser = await userRepository.updateUser(id,{
        ...req.body,
        student: updatedStudent
      });
      res.status(200).json(updatedUser);
    }
    if (user.role === "teacher") {
      const teacher = await userRepository.findById(req.body.teacherId);
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
      const department = await departmentRepository.findById(req.body.teacher.department.id);
      if (!department) return res.status(404).json({ message: "Department not found" });
      req.body.teacher.department = department;
      const updatedTeacher = await teacherRepository.updateTeacher(req.body.teacherId,req.body.teacher);
      const updatedUser = await userRepository.updateUser(id,{
        ...req.body,
        teacher: updatedTeacher
      });
      res.status(200).json(updatedUser);
    }
    if (user.role === "admin") {
      const admin = await userRepository.findById(req.body.adminId);
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      const updatedAdmin = await adminRepository.updateAdmin(req.body.adminId,req.body.admin);
      const updatedUser = await userRepository.updateUser(id,{
        ...req.body,
        admin: updatedAdmin
      });
      res.status(200).json(updatedUser);
    }
    
  });
}