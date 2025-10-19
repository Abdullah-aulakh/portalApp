import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { StudentController } from "../controllers/student.controller";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),StudentController.getAllStudents);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),StudentController.getStudentById);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),StudentController.deleteStudentById);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),StudentController.updateStudentById);
Router.get("/enrollments/:id", authentication,StudentController.getStudentEnrollments);

export { Router as studentRouter }; 