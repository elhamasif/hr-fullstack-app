import { Controller, Post, Body, Get, UseGuards ,Param} from '@nestjs/common';
import { ValidateHrDto } from './dto/register.dto'; 
import { UpdateHrDto } from './dto/UpdateHrDto';
import { Request } from 'express';
import {  UnauthorizedException, Patch, Req } from '@nestjs/common';
import { HrService } from './hr.service';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto,ResetPasswordVerifyDto } from './dto/resetpassword.dto';
import { EmployeeService } from 'src/employee/employee.service';


@Controller('hr')
export class HrController {
  empService: any;
  constructor(private readonly hrService: HrService) {}


  @Post('registration')
    saveHr(@Body() data: ValidateHrDto) {
      return this.hrService.saveHr(data);
    }
   
  
    @Post('login')
    HrLogin(@Body() data) {
      return this.hrService.loginHr(data);
    }

    @Patch('Updateprofile')
    async updateProfile(
      @Req() req: Request,
      @Body() updateDto: UpdateHrDto,
    ) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) throw new UnauthorizedException('Missing token');
    
      const token = authHeader.split(' ')[1];
      return this.hrService.updateHrProfile(token, updateDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async viewProfile(@Req() req) {
      return this.hrService.getHrProfile(req.user);
    } 
    
    @Post('forgot-password')
  async requestReset(@Body() body: ResetPasswordDto) {
    await this.hrService.sendResetCodeToEmail(body.email);
    return { message: 'Password reset link sent to email' };
  }

  @Post('resetpassword')
  async resetPassword(@Body() data: ResetPasswordVerifyDto) {
    await this.hrService.verifyResetTokenAndUpdatePassword(data.token, data.password);
    return { message: 'Password has been reset successfully' };
  }
  
}