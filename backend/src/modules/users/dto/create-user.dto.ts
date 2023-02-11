import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'email@email.com',
    description: 'email',
  })
  @IsString()
  @IsEmail()
  readonly email: string;
  @ApiProperty({
    example: 'Qwerty123',
    description: 'password',
  })
  @IsString()
  @Length(8, 20)
  readonly password: string;
}
