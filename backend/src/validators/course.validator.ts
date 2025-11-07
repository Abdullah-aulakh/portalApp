import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CourseDto } from "../dto/course.dto";

export const courseValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courseDto = plainToClass(CourseDto, req.body); // convert plain object to class instance and also do type conversion
  const errors: ValidationError[] = await validate(courseDto); // validate the class instance

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat();
    return res.status(400).json({ errors: errorMessages });
  } else {
    next();
  }
};