import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Hr } from './hr.entity';  
@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => Hr, hr => hr.passwordResets)
  @JoinColumn({ name: 'hrId' })
  hr: Hr;

  @Column({ type: 'timestamp' })
  expirationDate: Date;
}
