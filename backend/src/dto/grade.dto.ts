import {
  IsEnum,
  IsUUID,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GradeLetters } from '../enum/grade.letters';
import { GradeTypes } from '../enum/grade.types';

@ValidatorConstraint({ name: 'MarksValidation', async: false })
class MarksValidation implements ValidatorConstraintInterface {
  validate(marksObtained: number, args: ValidationArguments) {
    const obj = args.object as any;
    // only check if both values are provided
    if (
      typeof marksObtained === 'number' &&
      typeof obj.totalMarks === 'number'
    ) {
      return marksObtained <= obj.totalMarks;
    }
    return true; // skip validation if one is missing
  }

  defaultMessage(args: ValidationArguments) {
    return 'marksObtained cannot be greater than totalMarks';
  }
}

export class CreateGradeDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsOptional()
  @IsNumber()
  @Validate(MarksValidation)
  marksObtained?: number;

  @IsOptional()
  @IsNumber()
  totalMarks?: number;

  @IsOptional()
  @IsEnum(GradeLetters, { message: 'grade must be a valid GradeLetters value' })
  grade?: GradeLetters;

  @IsEnum(GradeTypes, { message: 'type must be a valid GradeTypes value' })
  type: GradeTypes;
}
