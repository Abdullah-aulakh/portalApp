import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { success, failure } from "../utils/response";

export class CourseController {
  private courseService = new CourseService();

  createCourse = async (req: Request, res: Response) => {
    try {
      const course = await this.courseService.createCourse(req.body);
      res.json(success("Course created successfully", course));
    } catch (err) {
      res.status(400).json(failure("Failed to create course", err));
    }
  };

  getAllCourses = async (_: Request, res: Response) => {
    try {
      const courses = await this.courseService.getAllCourses();
      res.json(success("Courses fetched successfully", courses));
    } catch (err) {
      res.status(500).json(failure("Error fetching courses", err));
    }
  };

  getCourseById = async (req: Request, res: Response) => {
    try {
      const course = await this.courseService.getCourseById(req.params.id);
      res.json(success("Course fetched successfully", course));
    } catch (err) {
      res.status(404).json(failure("Course not found", err));
    }
  };

  updateCourse = async (req: Request, res: Response) => {
    try {
      const updated = await this.courseService.updateCourse(req.params.id, req.body);
      res.json(success("Course updated successfully", updated));
    } catch (err) {
      res.status(400).json(failure("Failed to update course", err));
    }
  };

  deleteCourse = async (req: Request, res: Response) => {
    try {
      await this.courseService.deleteCourse(req.params.id);
      res.json(success("Course deleted successfully"));
    } catch (err) {
      res.status(400).json(failure("Failed to delete course", err));
    }
  };

  addStudentToCourse = async (req: Request, res: Response) => {
    try {
      const { courseId, studentId } = req.params;
      const enrollment = await this.courseService.addStudentToCourse(courseId, studentId);
      res.json(success("Student added to course", enrollment));
    } catch (err) {
      res.status(400).json(failure("Failed to add student", err));
    }
  };

  getStudentCourses = async (req: Request, res: Response) => {
    try {
      const studentId = req.user.id;
      const courses = await this.courseService.getStudentCourses(studentId);
      res.json(success("Student courses fetched", courses));
    } catch (err) {
      res.status(400).json(failure("Failed to get student courses", err));
    }
  };
}
