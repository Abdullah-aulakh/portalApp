// src/dto/create-admin-user.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsEnum } from 'class-validator';
import { UserDto } from './user.dto';
import { AdminRoles } from '../../enum/admin.roles';

class AdminDetailsDto {

  @IsNotEmpty()
  @IsEnum(AdminRoles,{message:"Invalid admin role"})
  accessLevel: string;
}

export class CreateAdminUserDto extends UserDto {
  @ValidateNested()
  @Type(() => AdminDetailsDto)
  admin: AdminDetailsDto;
}
