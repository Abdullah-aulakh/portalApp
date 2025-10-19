import { Router } from "express";
import { CourseController } from "../controllers/courses.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();
const courseController = new CourseController();

// CRUD (Admin only)
router.post("/", authenticate, authorizeRoles("ADMIN"), courseController.createCourse);
router.get("/", authenticate, authorizeRoles("ADMIN"), courseController.getAllCourses);
router.get("/:id", authenticate, courseController.getCourseById);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), courseController.updateCourse);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), courseController.deleteCourse);


export default router;
