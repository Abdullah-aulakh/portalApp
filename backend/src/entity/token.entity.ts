import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.token, {
    onDelete: 'CASCADE',
  })
  user: User;
}