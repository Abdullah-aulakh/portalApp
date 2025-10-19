import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './course.entity';
import { Teacher } from './teacher.entity';
import { Department } from './department.entity';

@Entity('timetables')
export class Timetable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.timetable, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @Column()
  dayOfWeek: string; // e.g., "Monday"

  @Column()
  startTime: string; // "09:00"

  @Column()
  endTime: string; // "10:30"

  @Column({ nullable: true })
  room: string;
}
