import { Users } from 'src/users/users.entity';
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity('sessions')
export class Sessions {
 @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  focusMinutes!: number;

  @Column({ type: 'bigint' })
  completedAt!: number; 

  @ManyToOne(() => Users, u => u.sessions, { onDelete: 'CASCADE' })
  @Index()
  user!: Users;

  @CreateDateColumn()
  createdAt!: Date;
}