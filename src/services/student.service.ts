import { Repository } from "typeorm";
import { Student } from "../entity/student.entity";
import { BaseService } from "./base.service";

export class StudentService extends BaseService<Student> {
  constructor(repo: Repository<Student>) {
    super(repo);
  }
}
