import { Repository } from "typeorm";
import { Timetable } from "../entity/timetable.entity";

export class TimetableService {
  constructor(private readonly timetableRepository: Repository<Timetable>) {}

  async find(): Promise<Timetable[]> {
    return await this.timetableRepository.find();
  }

  async findById(id: string): Promise<Timetable | null> {
    return await this.timetableRepository.findOne({
      where: { id },
    });
  }

  async createTimetable(timetable: Timetable): Promise<Timetable> {
    const newTimetable = this.timetableRepository.create(timetable);
    await this.timetableRepository.save(newTimetable);
    return newTimetable;
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.timetableRepository.delete(id);
    return result.affected !== 0;
  }
  async updateTimetable(id: string, timetableData: Partial<Timetable>): Promise<Timetable | null> {
    const timetable = await this.timetableRepository.findOneBy({ id });
    if (!timetable) return null;

    this.timetableRepository.merge(timetable, timetableData);
    await this.timetableRepository.save(timetable);
    return timetable;
  }

  async findByCourseAndDay(id: string,day:string): Promise<Timetable[]> {
    console.log(day);
    return await this.timetableRepository.find({
      where: { course:{id} ,dayOfWeek:day },
    });
  }
  async findByCourse(id: string): Promise<Timetable[]> {
    return await this.timetableRepository.find({
      where: { course:{id} },
      relations:{
        course:true
      }
    });
  }
}