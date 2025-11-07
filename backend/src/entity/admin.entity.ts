import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user: User) => user.admin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;   

  @Column()
  accessLevel: string;
}
