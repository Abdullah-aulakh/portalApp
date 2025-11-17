import { Request, Response } from "express";
import {
  attendanceRepository,
  courseRepository,
  studentRepository,
  enrollmentRepository,
} from "../repository";
import { catchAsync } from "../helpers/catch-async.helper";
import { v4 as uuid } from "uuid";


export class AttendanceController {
  static getStudentAttendanceData = catchAsync(async (req: Request, res: Response) => {
    const { registrationNumber } = req.params;

    const student = await studentRepository.findByRegistrationNumber(registrationNumber);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const activeEnrollments = await enrollmentRepository.findActiveEnrollments(student.id);

    const courseIds = activeEnrollments.map((enrollment) => enrollment.course.id);

    const attendanceData = await Promise.all(
      courseIds.map(async (courseId) => {
        const course = await courseRepository.findById(courseId);

        const {
          percentage,
          total,
          present,
        } = await attendanceRepository.getStudentAttendancePercentage(
          student.id,
          courseId
        );

        const records = await attendanceRepository.findStudentAttendanceRecords(
          student.id,
          courseId
        );

        return {
          ...course,
          attendancePercentage: percentage,
          totalClasses: total,
          attendedClasses: present,
          records,
        };
      })
    );

    res.status(200).json({
        student,
        attendanceData
    });
  });

  static updateAttendance = catchAsync(async (req: Request, res: Response) => {

     let records = req.body;

  // Assign IDs to new records
  records = records.map((r: { id: any; }) => ({
    ...r,
    id: r.id || uuid()   
  }));
    await attendanceRepository.updateAttendance(records);

    const updatedRecords = await attendanceRepository.findStudentAttendanceRecords(req.body[0].studentId,req.body[0].courseId);
    const {percentage,total,present} = await attendanceRepository.getStudentAttendancePercentage(req.body[0].studentId,req.body[0].courseId);
    res.status(200).json({
       records:updatedRecords,
       totalClasses:total,
       attendedClasses:present,
       attendancePercentage:percentage,
       id:uuid(),


     });
  });
  static getTodaysAttendance = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseRepository.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const attendanceData = await attendanceRepository.findTodaysAttendance(course.id);
    
    console.log(attendanceData);
    res.status(200).json(attendanceData);
  });
}

    