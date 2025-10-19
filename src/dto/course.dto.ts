import { IsString, IsOptional, IsNotEmpty, IsInt } from "class-validator";

export class CourseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsInt()
  teacherId?: number;
}
