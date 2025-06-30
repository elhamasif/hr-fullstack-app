import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './assignedTask.entity';
import { LeaveRequest } from './leave-request.entity';
import { Payment } from '../payment/entities/payment.entity';
@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ nullable: true, length: 50 })
  jobTitle: string;

  @Column({ unique: true, length: 50 })
  phone: string;

  @Column({ length: 100 })
  address: string;

  @Column({ select: false, length: 50 })
  password: string;

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];
  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequest[];
  @OneToMany(() => Payment, (payment) => payment.employee)
  payments: Payment[];
}
