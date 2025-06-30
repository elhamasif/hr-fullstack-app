import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

// Correct usage of class-validator decorators
export class ResetPasswordDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  }
  
  export class ResetPasswordVerifyDto {
    @IsNotEmpty({ message: 'Token is required' })
    token: string;
  
    @IsNotEmpty({ message: 'New password is required' })
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      {
        message:
          'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*), and be 8+ characters long',
      },
    )
    password: string;
  }
  