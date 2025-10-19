import { StudentResponseDto } from './student.response.dto';
import { CourseResponseDto } from './course.response.dto';

export class EnrollmentResponseDto {
  id: string;
  student: StudentResponseDto;
  course: CourseResponseDto;
  status: string;

  constructor(enrollment: any) {
    this.id = enrollment.id;
    this.student = new StudentResponseDto(enrollment.student);
    this.course = new CourseResponseDto(enrollment.course);
    this.status = enrollment.status;
  }
}