/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './emp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Task } from './assignedTask.entity';
import { Hr } from 'src/hr/Entity/hr.entity';
import { LeaveRequest } from './leave-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Task,Hr, LeaveRequest]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretkey123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtStrategy],
})
export class EmployeeModule {}
