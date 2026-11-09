import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      status?: string;
      roleId?: string;
      departmentId?: string;
    },
  ) {
    return this.userService.createUser(body);
  }
}
