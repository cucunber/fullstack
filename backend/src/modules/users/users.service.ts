import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles';
import { CreateUserDTO, AddRoleDTO, BanUserDTO } from './dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const user = await this.userRepository.create(dto);
    const roles = await this.roleService.getRoleByValue('User');
    await user.$set('roles', [roles.id]);
    user.roles = [roles];
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRole(dto: AddRoleDTO) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (!user || !role) {
      throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
    }
    await user.$add('role', role.id);
    return user;
  }

  async banUser(dto: BanUserDTO) {
    const user = await this.userRepository.findByPk(dto.userId);
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
