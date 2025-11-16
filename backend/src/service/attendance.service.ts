import { Repository } from "typeorm";

export class AttendanceService {
  constructor(private readonly attendanceRepository: Repository<any>) {}

  async find(): Promise<any[]> {
    return await this.attendanceRepository.find();
  }

  async findById(id: string): Promise<any | null> {
    return await this.attendanceRepository.findOne({
      where: { id },
    });
  }
  async findByCourse(id: string): Promise<any[]> {
    return await this.attendanceRepository.find({
      where: { course: { id } },
    });
  }
  async createAttendance(attendance: any): Promise<any> {
    const newAttendance = this.attendanceRepository.create(attendance);
    await this.attendanceRepository.save(newAttendance);
    return newAttendance;
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.attendanceRepository.delete(id);
    return result.affected !== 0;
  }
  async updateAttendance(id: string, attendanceData: Partial<any>): Promise<any | null> {
    const attendance = await this.attendanceRepository.findOneBy({ id });
    if (!attendance) return null;

    this.attendanceRepository.merge(attendance, attendanceData);
    await this.attendanceRepository.save(attendance);
    return attendance;
  }
  async getStudentAttendancePercentage(studentId: string,courseId: string): Promise<{percentage:number,total:number,present:number}> {
    // total attendance records for the student

    const total = await this.attendanceRepository.count({
      where: { student: { id: studentId }, course: { id: courseId } },
    });

    if (total === 0) return {percentage:100,total,present:0}; // avoid division by zero

    // count of present records
    const present = await this.attendanceRepository.count({
      where: { student: { id: studentId }, isPresent: true ,course:{id:courseId} },
    });

    // calculate percentage
    return {percentage:(present / total) * 100,total,present};
  }
}