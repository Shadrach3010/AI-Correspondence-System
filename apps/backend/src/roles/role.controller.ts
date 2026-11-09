import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getRoles() {
    return this.roleService.getRoles();
  }

  @Post()
  async createRole(
    @Body() body: { name: string; description?: string; permissions?: Record<string, unknown> },
  ) {
    return this.roleService.createRole(body);
  }
}
