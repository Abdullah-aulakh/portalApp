import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { DepartmentController } from "../controllers/department.controller";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),DepartmentController.getAllDepartments);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),DepartmentController.getDepartmentById);


export { Router as departmentRouter };