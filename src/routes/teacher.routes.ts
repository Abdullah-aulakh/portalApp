import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { TeacherController } from "../controllers/teacher.controller";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),TeacherController.getAllTeachers);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),TeacherController.getTeacherById);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),TeacherController.deleteTeacherById);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),TeacherController.updateTeacherById);

export { Router as teacherRouter };