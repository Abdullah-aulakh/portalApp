import { StudentResponseDto } from './student.response.dto';
import { CourseResponseDto } from './course.response.dto';

export class GradeResponseDto {
  id: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  type: string;
  student: StudentResponseDto;
  course: CourseResponseDto;

  constructor(grade: any) {
    this.id = grade.id;
    this.marksObtained = grade.marksObtained;
    this.totalMarks = grade.totalMarks;
    this.grade = grade.grade;
    this.type = grade.type;

    if (grade.student) {
      this.student = new StudentResponseDto(grade.student);
    }

    if (grade.course) {
      this.course = new CourseResponseDto(grade.course);
    }
  }
}
