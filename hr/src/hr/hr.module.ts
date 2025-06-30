import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { Hr } from './Entity/hr.entity';
import { Employee } from '../employee/emp.entity';
import { Task } from 'src/employee/assignedTask.entity';
import { MailModule } from '../mail/mail.module';
import { PasswordReset } from './Entity/passwordreset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Employee, Hr, PasswordReset]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
    JwtModule.register({
      secret: 'secretkey123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [HrController],
  providers: [HrService],
  
})
export class HrModule {}
