import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { CourseController } from "../controllers/course.controller";
import { courseValidator } from "../validators/course.validator";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),CourseController.getAllCourses);
Router.get("/:id", authentication,CourseController.getCourseById);
Router.post("/", authentication,authorization([UserRoles.ADMIN]), courseValidator,CourseController.createCourse);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),CourseController.updateCourse);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),CourseController.deleteCourse);
Router.get("/teacher/:id", authentication,authorization([UserRoles.ADMIN]),CourseController.getTeacherCourses);


export { Router as courseRouter };