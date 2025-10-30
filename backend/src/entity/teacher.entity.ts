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
import { Course } from './course.entity'

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.teacher, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Department, (department) => department.teachers, {
    onDelete: 'SET NULL',
  })
  department: Department;

  @Column({ nullable: false })
  designation: string; // Lecturer, Assistant Professor, etc.

  @Column({ nullable: false })
  position: string; // Head of Department, Faculty Member, etc.

  @Column({ type: 'int', default: 0 })
  experienceYears: number;

  @Column({ nullable: true })
  qualification: string; // PhD, MS, etc.


  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];


}
