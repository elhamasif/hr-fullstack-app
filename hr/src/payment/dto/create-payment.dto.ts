import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  employeeId: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
