import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { Enrollment } from './enrollment.entity';
import { Attendance } from './attendance.entity';
import { Grade } from './grade.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.student, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Department, (department) => department.students, {
    onDelete: 'SET NULL',
  })
  department: Department;

  @Column({ nullable: false })
  registrationNumber: string;

  @Column({ nullable: false })
  program: string; // e.g., "BS Computer Science"

  @Column({ nullable: false })
  currentSemester: number;

 
  @Column({ default: true })
  isEnrolled: boolean;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendanceRecords: Attendance[];

  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];
}
