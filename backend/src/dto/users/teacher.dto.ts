// src/dto/create-teacher-user.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsUUID, IsInt, Min, IsOptional } from 'class-validator';
import { UserDto } from './user.dto';

class TeacherDetailsDto {
  @IsNotEmpty()
  designation: string;

  @IsNotEmpty()
  position: string;

  @IsUUID()
  @IsNotEmpty()
  departmentId: string;

  @IsInt()
  @Min(0)
  experienceYears: number;

  @IsOptional()
  qualification?: string;
}

export class CreateTeacherUserDto extends UserDto {
  @ValidateNested()
  @Type(() => TeacherDetailsDto)
  teacher: TeacherDetailsDto;
}
