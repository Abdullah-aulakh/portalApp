import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { GradeController } from "../controllers/grade.controller";
import { gradeValidator } from "../validators/grade.validator";
const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),GradeController.getAllGrades);
Router.get("/reg/:registrationNumber", authentication,authorization([UserRoles.ADMIN]),GradeController.getStudentGrades);
Router.post("/", authentication,authorization([UserRoles.ADMIN]), gradeValidator,GradeController.createGrade);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),GradeController.getGradeById);
Router.put("/", authentication,authorization([UserRoles.ADMIN]),GradeController.updateGrades);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),GradeController.deleteGradeById);

export { Router as gradeRouter };