import * as express from "express";
import { CourseController } from "../controllers/course.controller";
import { authentification } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRole } from "../enum/user.roles";
import { validateDto } from "../middleware/authentication";
import { CourseDto } from "../dto/course.dto";

const Router = express.Router();

// Public: list courses
Router.get("/courses", CourseController.getAll);

// Admin-only: create, update, delete, assign student
Router.post("/courses", authentification, authorization([UserRole.ADMIN]), validateDto(CourseDto), CourseController.createCourse);
Router.put("/courses/:id", authentification, authorization([UserRole.ADMIN]), CourseController.updateCourse);
Router.delete("/courses/:id", authentification, authorization([UserRole.ADMIN]), CourseController.deleteCourse);

// Admin can assign student to a course
Router.post("/courses/:courseId/assign-student", authentification, authorization([UserRole.ADMIN]), CourseController.assignStudentToCourse);

// Teacher & Admin: get courses for a teacher
Router.get("/teachers/:teacherId/courses", authentification, authorization([UserRole.TEACHER, UserRole.ADMIN]), CourseController.getCoursesByTeacher);

// Student: get own enrollments
Router.get("/my/enrollments", authentification, authorization([UserRole.STUDENT]), CourseController.getMyEnrollments);

export { Router as courseRouter };
