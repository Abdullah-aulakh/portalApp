import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { StudentController } from "../controllers/student.controller";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),StudentController.getAllStudents);
Router.get("/getProfile/:id", authentication,authorization([UserRoles.STUDENT,UserRoles.ADMIN]),StudentController.getStudentProfile);
Router.get("/timetable/:id", authentication,authorization([UserRoles.STUDENT,UserRoles.ADMIN]),StudentController.getStudentTimeTable);
Router.get("/attendance/:id", authentication,authorization([UserRoles.STUDENT,UserRoles.ADMIN]),StudentController.getStudentAttendanceData);
Router.get("/grade/:id", authentication,authorization([UserRoles.STUDENT,UserRoles.ADMIN]),StudentController.getStudentGradeData);
Router.get("/reg/:registrationNumber", authentication,authorization([UserRoles.ADMIN]),StudentController.getStudentByRegistrationNumber);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),StudentController.getStudentById);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),StudentController.deleteStudentById);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),StudentController.updateStudentById);

export { Router as studentRouter }; 