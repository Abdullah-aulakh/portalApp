import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Student } from './student.entity';
import { Course } from './course.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.attendanceRecords, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @ManyToOne(() => Course, (course) => course.attendanceRecords, {
    onDelete: 'CASCADE',
  })
  course: Promise<Course>;
;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  isPresent: boolean;
}
