import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ValidateEmployeeDto } from './DTO/validate.dto';
import { AuthGuard } from '@nestjs/passport';
import { updateValidateEmployeeDto } from './DTO/updateValidate.dto';
import { AssignTaskDto } from './DTO/assign-task.dto';
import { LeaveRequest } from './leave-request.entity';
import { UpdateLeaveStatusDto } from './DTO/update-leave-status.dto';
@Controller('employee')
export class EmployeeController {
  constructor(private readonly empService: EmployeeService) {}

  @Post('registration')
  saveEmployee(@Body() data: ValidateEmployeeDto) {
    return this.empService.saveEmployee(data);
  }

  @Post('login')
  empLogin(@Body() data) {
    return this.empService.empLogin(data);
  }
  @UseGuards(AuthGuard('jwt')) // ✅ Secured with JWT
@Get('all')                  // ✅ Listens to GET /employee/all
async getAllEmployees(@Request() req) {
  await this.empService.verifyHR(req.user); // ✅ Ensures only HR can access
  return this.empService.getAllEmployees();
}
  @Post('assign')
  @UseGuards(AuthGuard('jwt')) // Ensures that the request is authenticated with JWT
  async assignTask(@Body() data: AssignTaskDto, @Request() req) {
    // `req.user` will contain the decoded JWT payload (sub = user ID)
    return this.empService.assignTask(data, req.user); // Pass user data to service
  }

  @Patch('updateTaskStatus')
@UseGuards(AuthGuard('jwt'))
updateTaskStatusByHR(
  @Body() body: { taskId: number; employeeId: number; status: 'pending' | 'in_progress' | 'completed' },
  @Request() req,
) {
  return this.empService.updateTaskStatusByHR(body, req.user);
}

@Post('Taskfilter')
@UseGuards(AuthGuard('jwt')) 
async filterTasks(
  @Body()
  filter: {
    employeeId?: number;
    status?: 'pending' | 'in_progress' | 'completed';
    dueDate?: string;
    endDate?: string;
  },
  @Request() req,
) {
  return this.empService.filterTask(filter, req.user);
}

 // Create a leave request
 @Post('leaverequest')
 async createLeaveRequest(@Body() leaveRequestDto: LeaveRequest) {
   return this.empService.createLeaveRequest(leaveRequestDto);
 }
//  View all leave requests
@Get('ViewLeaveRequest')
@UseGuards(AuthGuard('jwt')) 
async viewAll(@Request() req) {
  return this.empService.viewAllLeaveRequests(req.user);
}

//  Update leave request status
@Patch('updateLeaveStatus')
@UseGuards(AuthGuard('jwt')) 
async updateStatus(
  @Body() body:  UpdateLeaveStatusDto,
  @Request() req,
) {
  // Update leave status
  return this.empService.updateLeaveStatus(req.user, body.employeeId, body.status);
}
}

