import { Request, Response } from "express";
import { gradeRepository,studentRepository,enrollmentRepository,courseRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";


export class GradeController {
  
  static getAllGrades = catchAsync(async (req: Request, res: Response) => {
    const grades = await gradeRepository.find();
    res.status(200).json(grades);
  });
  static getGradeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const grade = await gradeRepository.findById(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });
    res.status(200).json(grade);
  });

  static deleteGradeById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const grade = await gradeRepository.findById(id);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    await gradeRepository.delete(id);
    res.status(200).json({ message: "Grade deleted successfully" });
  });



  static createGrade = catchAsync(async (req: Request, res: Response) => {
    const student = await studentRepository.findById(req.body.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    req.body.student = student;
    const course = await courseRepository.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    req.body.course = course;
    const grade = await gradeRepository.createGrade(req.body);
    res.status(201).json(grade);
  });

  static getStudentGrades = catchAsync(async (req: Request, res: Response) => {
    const {registrationNumber} = req.params;
    const student = await studentRepository.findByRegistrationNumber(registrationNumber);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const activeEnrollments = await enrollmentRepository.findActiveEnrollments(student.id);
    const courseIds = activeEnrollments.map(enrollment => enrollment.course.id);

    const gradeData = await Promise.all(
      courseIds.map(async (courseId) => {
        const course = await courseRepository.findById(courseId);
        const grades = await gradeRepository.findStudentGrades(courseId,student.id);
        return {
          ...course,
          grades
        };
      })
    );
    res.status(200).json({
      student,
      courses:gradeData
    });
  });

  static updateGrades = catchAsync(async (req: Request, res: Response) => {
    const records = req.body;
    console.log(records);

    await gradeRepository.updateGrade(records);

   return res.status(200).json({ message: "Grade updated successfully" });
  });
}