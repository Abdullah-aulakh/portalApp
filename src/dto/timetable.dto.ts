import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateTimetableDto {
  @IsUUID()
  @IsNotEmpty({ message: 'courseId is required' })
  courseId: string;

  @IsString()
  @IsIn(
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    { message: 'dayOfWeek must be a valid day name' },
  )
  dayOfWeek: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:MM 24-hour format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:MM 24-hour format',
  })
  endTime: string;

  @IsOptional()
  @IsString()
  room?: string;
}
