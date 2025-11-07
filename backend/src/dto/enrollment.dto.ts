import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../enum/enrollment.status';

export class EnrollmentDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;

  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus 
}
