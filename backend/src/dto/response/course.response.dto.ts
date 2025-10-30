import { TeacherResponseDto } from './teacher.response.dto';

export class CourseResponseDto {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  teacher?: TeacherResponseDto;

  constructor(course: any) {
    this.id = course.id;
    this.code = course.code;
    this.title = course.title;
    this.creditHours = course.creditHours;

    if (course.teacher) {
      this.teacher = new TeacherResponseDto(course.teacher);
    }
  }
}
