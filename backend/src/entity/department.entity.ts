import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';


@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  building: string;

  @OneToOne(() => Teacher, { nullable: true })
  @JoinColumn()
  headOfDepartment: Teacher;

  @OneToMany(() => Teacher, (teacher) => teacher.department)
  teachers: Teacher[];

  @OneToMany(() => Student, (student) => student.department)
  students: Student[];

}
