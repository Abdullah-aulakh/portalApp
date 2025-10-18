// src/dto/create-student-user.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsUUID, IsInt, Min, Max} from 'class-validator';
import { UserDto } from './user.dto';

class StudentDetailsDto {

@IsNotEmpty()
  @IsUUID()
  departmentId: string;

  @IsNotEmpty()
  registrationNumber: string;

  @IsNotEmpty()
  program: string;

  @IsInt()
  @Min(1)
  @Max(8)
  currentSemester: number;
}

export class CreateStudentUserDto extends UserDto {
  @ValidateNested()
  @Type(() => StudentDetailsDto)
  student: StudentDetailsDto;
}
