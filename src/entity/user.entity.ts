import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../enum/user.roles';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { Admin } from './admin.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  role: UserRoles;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profilePicture: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Student, (student) => student.user, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  teacher: Teacher;

  @OneToOne(() => Admin, (admin) => admin.user, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  admin: Admin;
}
