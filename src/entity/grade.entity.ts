import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Student } from './student.entity';
import { Course } from './course.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.grades, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @ManyToOne(() => Course, (course) => course.grades, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column({ type: 'float', nullable: true })
  marksObtained: number;

  @Column({ type: 'float', nullable: true })
  totalMarks: number;

  @Column({ nullable: true })
  grade: string; // e.g., "A", "B", "C"

  @Column({nullable:false})
  type: string;
  
}
