import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Teacher } from './teacher.entity';
import { Enrollment } from './enrollment.entity';
import { Timetable } from './timetable.entity'
import { Grade } from './grade.entity';
import { Attendance } from './attendance.entity';
import { Department } from './department.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // e.g., CS101

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'int' ,nullable: false})
  creditHours: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, {
    onDelete: 'SET NULL',
  })
  teacher: Teacher;

  @ManyToOne(() => Department, (department) => department.courses, {
  onDelete: 'SET NULL',
})
department: Department;


  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Timetable, (timetable) => timetable.course)
  timetable: Timetable[];

  @OneToMany(() => Grade, (grade) => grade.course)
  grades: Grade[];

  @OneToMany(() => Attendance, (attendance) => attendance.course)
  attendanceRecords: Attendance[];
}
