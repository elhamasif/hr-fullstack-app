

import { IsEnum, IsNumber } from 'class-validator';

export class UpdateLeaveStatusDto {
  @IsNumber({}, { message: 'Employee ID must be a valid number' })
  employeeId: number;

  @IsEnum(['accepted', 'rejected','pending'], { message: 'Status must be one of the following: accepted, rejected, pending' })
  status: 'accepted' | 'rejected'| 'pending';
}
