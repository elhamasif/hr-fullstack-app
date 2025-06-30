// src/employee/DTO/assign-task.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class AssignTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  assigneeId: number;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed'],{ message: 'Status must be one of the following: pending, in-progress,completed' })
  status?: 'pending' | 'in-progress' | 'completed';
}
