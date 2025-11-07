import { IsString, IsNotEmpty, IsUUID, IsInt, Min, Max, IsOptional, Length } from 'class-validator';

export class CourseDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsInt()
  @Min(1)
  @Max(6)
  creditHours: number;

  @IsUUID()
  @IsOptional()
  teacherId?: string;
}
