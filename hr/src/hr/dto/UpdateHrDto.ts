/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsEmail, Matches } from 'class-validator';

export class UpdateHrDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  email?: string;

  @IsOptional()
  @Matches(/01[3-9]\d{8}$/, { message: 'Enter a valid phone number' })
  phone?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message:
        'Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special char, and be 8+ chars',
    },
  )
  password?: string;
}
