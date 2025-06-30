
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class updateValidateEmployeeDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsAlpha('en-US', { message: 'Name should contain only alphabets' })
  name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Job Title is required' })
  @IsAlpha('en-US', { message: 'Job Title should contain only alphabets' })
  jobTitle: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/01[3-9]\d{8}$/, { message: 'Enter a valid phone number' })
  phone: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsOptional()
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
