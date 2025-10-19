import e, { Request, Response } from "express";
import { courseRepository, teacherRepository } from "../repository";

import { catchAsync } from "../helpers/catch-async.helper";
import { CourseResponseDto } from "../dto/response/course.response.dto";

export class CourseController {
  static getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const courses = await courseRepository.findAll();
    res.status(200).json(courses.map((c) => new CourseResponseDto(c)));
  });
  static getCourseById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(new CourseResponseDto(course));
  });
  static createCourse = catchAsync(async (req: Request, res: Response) => {
    const isAlreadyExists = await courseRepository.findByCode(req.body.code);
    if (isAlreadyExists)
      return res.status(400).json({ message: "Course code already exists" });
    if (req.body?.teacherId) {
      const teacher = await teacherRepository.findById(req.body.teacherId);
      if (!teacher)
        return res.status(404).json({ message: "Teacher not found" });
      req.body.teacher = teacher;
    }
    const course = await courseRepository.createCourse(req.body);
    res.status(201).json(new CourseResponseDto(course));
  });
  static updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const updatedCourse = await courseRepository.updateCourse(id, req.body);
    res.status(200).json(new CourseResponseDto(updatedCourse));
  });
  static deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await courseRepository.delete(id);
    res.status(200).json({ message: "Course deleted successfully" });
  });

  static getTeacherCourses = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const courses = await courseRepository.findByTeacherId(id);
    res.status(200).json(courses.map(c => new CourseResponseDto(c)));
  });
}
