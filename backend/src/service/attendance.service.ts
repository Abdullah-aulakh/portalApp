import { Repository } from "typeorm";
import { Attendance } from "../entity";
import { relative } from "path";

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
  async findStudentAttendanceRecords(studentId:string,courseId:string): Promise<any[]> {
    return await this.attendanceRepository.find({
      where: { student: { id: studentId }, course: { id: courseId } },
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

  async updateAttendance(records: any[]): Promise<void> {
  const formatted = records.map(r => ({
    id: r.id,
    date: r.date,
    isPresent: r.isPresent,
    student: { id: r.studentId },
    course: { id: r.courseId }
  }));
  console.log(formatted);

  await this.attendanceRepository.save(formatted);
}

async findTodaysAttendance(courseId: string): Promise<any[]> {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${yyyy}-${mm}-${dd}`; // "2025-11-17"

  console.log(formattedToday);
  return await this.attendanceRepository.find({
    where: {
      course: { id: courseId },
      date: formattedToday,
      
    },
    relations:{
      student:true,
      course:true
    }
  });
}

}