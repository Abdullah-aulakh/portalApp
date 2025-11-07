// src/middlewares/userValidator.ts
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../enum/user.roles';
import { UserDto } from '../dto/users/user.dto';
import { CreateTeacherUserDto } from '../dto/users/teacher.dto';
import { CreateStudentUserDto } from '../dto/users/student.dto';
import { CreateAdminUserDto } from '../dto/users/admin.dto';

export const userValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let dtoClass = UserDto;

    // 1️⃣ Pick DTO based on user role
    switch (req.body.role) {
      case UserRoles.TEACHER:
        dtoClass = CreateTeacherUserDto;
        break;
      case UserRoles.STUDENT:
        dtoClass = CreateStudentUserDto;
        break;
      case UserRoles.ADMIN:
        dtoClass = CreateAdminUserDto;
        break;
      default:
        return res.status(400).json({ message: 'Invalid or missing user role' });
    }

    // 2️⃣ Convert body to DTO
    const dtoInstance = plainToInstance(dtoClass, req.body);

    // 3️⃣ Validate
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    // 4️⃣ If sub-data missing (teacher/student/admin)
    if (
      (req.body.role === UserRoles.TEACHER && !req.body.teacher) ||
      (req.body.role === UserRoles.STUDENT && !req.body.student) ||
      (req.body.role === UserRoles.ADMIN && !req.body.admin)
    ) {
      return res.status(400).json({ message: ` ${req.body.role} Data is missing` });
    }

    // 5️⃣ Validation errors
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.children?.map((child) => child.constraints) || {}))
        .flat();
      return res.status(400).json({ errors: errorMessages });
    }

    // 6️⃣ If valid, continue
    req.body = dtoInstance;
    next();
  } catch (error) {
    console.error('Validation Error:', error);
    return res.status(500).json({ message: 'Validation failed', error });
  }
};
