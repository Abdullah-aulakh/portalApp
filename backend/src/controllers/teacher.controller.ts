import { Request, Response } from "express";
import { teacherRepository,timetableRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";
import { TeacherResponseDto } from "../dto/response/teacher.response.dto";
import { getDay } from "../helpers/date-time.helper";
export class TeacherController {
  
  static getAllTeachers = catchAsync(async (req: Request, res: Response) => {
    const teachers = await teacherRepository.find();
    res.status(200).json(teachers.map(t => new TeacherResponseDto(t)));
  });
  static getTeacherById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(new TeacherResponseDto(teacher));
  });

  static deleteTeacherById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await teacherRepository.delete(id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  });

  static updateTeacherById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = await teacherRepository.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const updatedTeacher = await teacherRepository.updateTeacher(id, req.body);
    res.status(200).json(updatedTeacher);
  });

 static getTeacherProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await teacherRepository.findByUserId(id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const courses = await teacherRepository.findCourses(teacher.id);

  const today = new Date().toLocaleString("en-US", { weekday: "long" });

  // Collect ALL today's timetable entries from ALL courses
  const todaysClasses = (
    await Promise.all(
      courses.map(async (course) => {
        const timetables = await timetableRepository.findByCourse(course.id);
        return timetables.filter(t => t.dayOfWeek === today);
      })
    )
  ).flat(); // flatten nested arrays

  res.status(200).json({
    ...teacher,
    courses,        // plain list of courses
    todaysClasses   // all classes for today
  });
});

static getTeacherSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await teacherRepository.findByUserId(id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const courses = await teacherRepository.findCourses(teacher.id);

  const schedule = await Promise.all(
    courses.map(async (course) => {
      const timetables = await timetableRepository.findByCourse(course.id);
      return {
        ...course,
        timetables
      };
    })
  );

  res.status(200).json(schedule);
});

static getTeacherCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = await teacherRepository.findByUserId(id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  const courses = await teacherRepository.findCourses(teacher.id);
  res.status(200).json(courses);
});
}