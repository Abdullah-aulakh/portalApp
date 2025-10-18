import { Request, Response } from "express";
import { departmentRepository } from "../repository/index";
import { Department } from "../entity/department.entity";
import { catchAsync } from "../helpers/catch-async.helper";

import { UserRoles } from "../enum/user.roles";
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

}