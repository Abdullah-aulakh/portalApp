import e, { Request, Response } from "express";
import { courseRepository, teacherRepository,departmentRepository } from "../repository";

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
    const department = await departmentRepository.findById(req.body.departmentId);
    if (!department)
      return res.status(404).json({ message: "Department not found" });
    req.body.department = department;
    const course = await courseRepository.createCourse(req.body);
    res.status(201).json(course);
  });
  static updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if(req.body.teacherId){
      const teacher = await teacherRepository.findById(req.body.teacherId);
      if (!teacher)
        return res.status(404).json({ message: "Teacher not found" });
      req.body.teacher = teacher;
    }
    else{
      req.body.teacher = null;
    }
    const updatedCourse = await courseRepository.updateCourse(id, req.body);
    res.status(200).json(updatedCourse);
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
