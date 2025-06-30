/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidateHrDto } from './dto/register.dto'; 
import { LoginDto } from './dto/login.dto';
import { Hr } from './Entity/hr.entity';
import { Employee } from '../employee/emp.entity';
import { Task } from 'src/employee/assignedTask.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { UpdateHrDto } from './dto/UpdateHrDto';
import { ResetPasswordDto } from './dto/resetpassword.dto'; 
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PasswordReset } from './Entity/passwordreset.entity';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Hr)
    private hrRepository: Repository<Hr>, 
    private jwtService: JwtService,
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private readonly mailService: MailService,
  ) {}

  // Register HR
  async saveHr(hrData: ValidateHrDto): Promise<{ message: string;}> {
    const hashedPassword = await bcrypt.hash(hrData.password, 10);
  
    const hr = this.hrRepository.create({
      ...hrData,
      password: hashedPassword,
    });
  
    try {
      const savedHr = await this.hrRepository.save(hr);
      return { message: 'HR registration successful' };} catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.detail.includes('email')) {
          throw new ConflictException('Email already exists');
        } else if (error.detail.includes('phone')) {
          throw new ConflictException('Phone number already exists');
        } else {
          throw new ConflictException('Duplicate entry found');
        }
      }
  
      // Any other unexpected error
      throw new NotFoundException('Failed to register HR');
    }
  }
  // Login for HR
async loginHr(loginData: LoginDto) {
    const { email, password } = loginData;
  
    // Check if the HR exists, include password explicitly
    const hr = await this.hrRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  
    if (!hr) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, hr.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Generate and return a JWT token
    const payload = { email: hr.email, sub: hr.id };
    const token = this.jwtService.sign(payload);
  
    return { access_token: token };
  }
  //update HR profile
  async updateHrProfile(token: string, updateDto: UpdateHrDto) {
    const decoded = this.jwtService.verify(token);
    const hr = await this.hrRepository.findOneBy({ id: decoded.sub });
  
    if (!hr) throw new NotFoundException('HR not found');
  
    if (updateDto.password) {
      const hashed = await bcrypt.hash(updateDto.password, 10);
      updateDto.password = hashed;
    }
  
    Object.assign(hr, updateDto);
    return await this.hrRepository.save(hr);
  }
// Get HR profile
async getHrProfile(user: any): Promise<Hr> {
  const hr = await this.hrRepository.findOne({
    where: { email: user.email },
  });

  if (!hr) {
    throw new NotFoundException('HR not found');
  }

  return hr;
}
// Request password reset
async sendResetCodeToEmail(email: string) {
  const user = await this.hrRepository.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const token = crypto.randomBytes(32).toString('hex');
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 15);

  const resetRecord = this.passwordResetRepository.create({
    token,
    hr: user,
    expirationDate,
  });

  await this.passwordResetRepository.save(resetRecord);

  const resetLink = `http://localhost:3000/resetpassword/${token}`;
  await this.mailService.sendPasswordResetEmail(user.email, resetLink);
}

async verifyResetTokenAndUpdatePassword(token: string, newPassword: string) {
  const resetRecord = await this.passwordResetRepository.findOne({
    where: { token },
    relations: ['hr'],
  });

  if (!resetRecord) throw new Error('Invalid or expired token');
  if (new Date() > resetRecord.expirationDate) throw new Error('Token has expired');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = resetRecord.hr;
  user.password = hashedPassword;
  await this.hrRepository.save(user);

  await this.passwordResetRepository.delete({ token });
}
}
