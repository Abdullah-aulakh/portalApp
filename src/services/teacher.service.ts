import { Repository } from "typeorm";
import { Teacher } from "../entity/teacher.entity";
import { BaseService } from "./base.service";

export class TeacherService extends BaseService<Teacher> {
  constructor(repo: Repository<Teacher>) {
    super(repo);
  }
}
