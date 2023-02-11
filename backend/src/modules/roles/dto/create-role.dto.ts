import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDTO {
  @ApiProperty({ example: 'Admin', description: 'role' })
  readonly value: string;
  @ApiProperty({
    example: 'admin rules',
    description: 'description of the role',
  })
  readonly description: string;
}
