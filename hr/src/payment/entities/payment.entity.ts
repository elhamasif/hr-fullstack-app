import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Employee } from 'src/employee/emp.entity';
  
  @Entity()
  export class Payment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;
  
    @Column()
    employeeId: number;
  
    @Column()
    stripeSessionId: string;
  
    @Column({ default: 'pending' })
    status: 'pending' | 'success';
  
    @Column()
    amount: number;
  
    @Column()
    description: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  