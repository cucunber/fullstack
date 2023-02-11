import { UseGuards } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { RoleGuards } from '../auth/roles.guard';
import { ValidationPipe } from '../pipes/validator.pipe';
import { AddRoleDTO, BanUserDTO, CreateUserDTO } from './dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Add user' })
  @ApiResponse({ status: 200, type: User })
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDTO: CreateUserDTO) {
    return this.usersService.createUser(userDTO);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Add role' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('Admin')
  @UseGuards(RoleGuards)
  @Post('/role')
  addRole(@Body() dto: AddRoleDTO) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Ban user' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('Admin')
  @UseGuards(RoleGuards)
  @Post('/ban')
  banUser(@Body() dto: BanUserDTO) {
    return this.usersService.banUser(dto);
  }
}
