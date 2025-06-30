/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsAlpha, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class ValidateEmployeeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsAlpha('en-US', { message: 'Name should contain only alphabets' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsNotEmpty({ message: 'Job Title is required' })
  @IsAlpha('en-US', { message: 'Job Title should contain only alphabets' })
  jobTitle: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/01[3-9]\d{8}$/, { message: 'Enter a valid phone number' })
  phone: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message:
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*), and be 8+ characters long',
    },
  )
  password: string;
}
