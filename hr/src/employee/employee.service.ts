
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './emp.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Task } from './assignedTask.entity';
import { AssignTaskDto } from './DTO/assign-task.dto';
import { Hr } from 'src/hr/Entity/hr.entity';
import { BadRequestException } from '@nestjs/common';
import { LeaveRequest } from '../employee/leave-request.entity';


@Injectable()
export class EmployeeService {
  jwtService: any;

  constructor(
    @InjectRepository(Employee) private myRepo: Repository<Employee>,
    @InjectRepository(LeaveRequest)
    private leaveRequestRepo: Repository<LeaveRequest>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Hr)
    private hrRepo: Repository<Hr>,
  ) { }

  async saveEmployee(data) {
    await this.myRepo.save(data)
    return "Employee saved successfully";
  }
  async getEmpData(id) {
    const employee = await this.myRepo.findOne({ where: { id } })
    if (!employee) {
      return "No employee found";
    }
    else {
      return employee;
    }
  }

  async empLogin(data) {
    const employee = await this.myRepo.findOne({
      where: { email: data.email, password: data.password },
      select: ['id', 'name', 'email', 'jobTitle', 'phone', 'address']
    });

    if (!employee) {
      return "Invalid Username or Password";
    } else {
      const payload = {
        email: employee.email,
        sub: employee.id,
        name: employee.name
      };
      return {
        access_token: this.jwtService.sign(payload),
        employee: employee,
        message: employee.name + " logged in successfully",
      };
    }
  }
async getAllEmployees(): Promise<Employee[]> {
  return this.myRepo.find({
    select: ['id', 'name', 'email', 'jobTitle'], // Choose what fields to return
  });
}
//  verify HR
async verifyHR(user: any): Promise<Hr> {
  const hr = await this.hrRepo.findOne({ where: { id: user.sub } });
  if (!hr) throw new UnauthorizedException('Not a valid HR');
  return hr;
}

//  Assign Task
async assignTask(data: AssignTaskDto, user: any) {
  await this.verifyHR(user);

  const employee = await this.myRepo.findOne({ where: { id: data.assigneeId } });
  if (!employee) {
    throw new NotFoundException('Assignee not found');
  }

  const task = this.taskRepo.create({
    title: data.title,
    description: data.description,
    dueDate: new Date(data.dueDate),
    status: data.status || 'pending',
    assignee: employee,
  });

  await this.taskRepo.save(task);
  return { message: 'Task assigned successfully', task };
}

//  HR updates task status
async updateTaskStatusByHR(
  body: {
    taskId: number;
    employeeId: number;
    status: 'pending' | 'in_progress' | 'completed';
  },
  user: any,
) {
  const hr = await this.hrRepo.findOne({ where: { id: user.sub } });
  if (!hr) throw new UnauthorizedException('Only HR can update task status');

  const { taskId, employeeId, status } = body;

  const task = await this.taskRepo.findOne({
    where: { id: taskId, assignee: { id: employeeId } },
    relations: ['assignee'],
  });

  if (!task) throw new NotFoundException('Task not found for given employee');

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestException('Invalid status value');
  }

  task.status = status;
  task.updatedAt = new Date();
  await this.taskRepo.save(task);

  return {
    message: `Task status updated for employee ID ${employeeId}`,
    task,
  };
}

//  HR filters tasks
async filterTask(
  filter: {
    employeeId?: number;
    status?: 'pending' | 'in_progress' | 'completed';
    dueDate?: string;      
    endDate?: string;     
  },
  user: any,
) {
  const hr = await this.hrRepo.findOne({ where: { id: user.sub } });
  if (!hr) throw new UnauthorizedException('Only HR can filter tasks');

  const query = this.taskRepo.createQueryBuilder('task')
    .leftJoinAndSelect('task.assignee', 'employee');

  if (filter.employeeId) {
    query.andWhere('employee.id = :employeeId', { employeeId: filter.employeeId });
  }

  if (filter.status) {
    query.andWhere('task.status = :status', { status: filter.status });
  }

  if (filter.dueDate) {
    query.andWhere('task.dueDate >= :dueDate', { dueDate: filter.dueDate });
  }

  if (filter.endDate) {
    query.andWhere('task.dueDate <= :endDate', { endDate: filter.endDate });
  }

  const tasks = await query.getMany();

  return {
    message: 'Filtered tasks based on criteria',
    tasks,
  };
}
//add request leave
// Create a new leave request
async createLeaveRequest(leaveRequestDto: LeaveRequest): Promise<LeaveRequest> {
  const { employeeId, requestDate, returnDate, status } = leaveRequestDto;

  // Check if employee exists
  const employee = await this.myRepo.findOne({ where: { id: employeeId } });
  if (!employee) {
    throw new Error('Employee not found');
  }

  const leaveRequest = this.leaveRequestRepo.create({
    employee,
    requestDate,
    returnDate,
    status,
  });

  return this.leaveRequestRepo.save(leaveRequest);
}
// View all leave requests
async viewAllLeaveRequests(user: any) {
  await this.verifyHR(user);
  return this.leaveRequestRepo.find({
    relations: ['employee'],
    select: ['id', 'employeeId', 'requestDate', 'returnDate', 'status'],
    order: { requestDate: 'DESC' },
  });
}

// Update status of a leave request by employeeId
async updateLeaveStatus(user: any,employeeId: number, status: 'accepted' | 'rejected'| 'pending') {
  
  await this.verifyHR(user);
  const leaveRequest = await this.leaveRequestRepo.findOne({
    where: { employeeId, status: 'pending' },
    order: { requestDate: 'DESC' },
  });

  if (!leaveRequest) {
    throw new NotFoundException(`No pending leave request found for employee ID ${employeeId}`);
  }

  leaveRequest.status = status;
  return this.leaveRequestRepo.save(leaveRequest);
}
}
