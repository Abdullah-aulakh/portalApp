import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { DepartmentController } from "../controllers/department.controller";

const Router = express.Router();

Router.get("/", authentication,DepartmentController.getAllDepartments);
Router.get("/:id", authentication,DepartmentController.getDepartmentById);
Router.post("/", authentication,authorization([UserRoles.ADMIN]),DepartmentController.createDepartment);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),DepartmentController.updateDepartment);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),DepartmentController.deleteDepartment);
Router.get("/teachers/:id", authentication,authorization([UserRoles.ADMIN]),DepartmentController.getDepartmentTeachers);
Router.get("/students/:id", authentication,authorization([UserRoles.ADMIN]),DepartmentController.getDepartmentStudents);

export { Router as departmentRouter };