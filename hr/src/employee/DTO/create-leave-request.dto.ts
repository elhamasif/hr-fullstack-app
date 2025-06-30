
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsDateString()
  requestDate: string;

  @IsDateString()
  returnDate: string;

  @IsEnum(['pending', 'accepted', 'rejected'], { message: 'Status must be one of the following: pending, accepted, rejected' })
  status: 'pending' | 'accepted' | 'rejected';

  @IsOptional()
  @IsNumber({}, { message: 'Employee ID must be a valid number' })
  employeeId: number;
}
