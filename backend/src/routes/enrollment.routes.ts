import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { enrollmentValidator } from "../validators/enrollment.validator";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),EnrollmentController.getAllEnrollments);
Router.get("/student/:id", authentication,authorization([UserRoles.ADMIN]),EnrollmentController.getStudentEnrollments);
Router.get("/studentsOfCourse/:id", authentication,authorization([UserRoles.ADMIN,UserRoles.TEACHER]),EnrollmentController.getStudentsofCourse);
Router.post("/", authentication,authorization([UserRoles.ADMIN]),enrollmentValidator,EnrollmentController.createEnrollment);
Router.get("/:id", authentication,EnrollmentController.getEnrollmentById);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),EnrollmentController.deleteEnrollmentById);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),EnrollmentController.updateEnrollmentById);

export { Router as enrollmentRouter };