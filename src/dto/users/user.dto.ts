import { IsString, IsEmail, IsOptional,IsEnum } from "class-validator";
import { UserRoles } from "../../enum/user.roles";

export class UserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserRoles,{message:"Invalid role"})
  role?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}
