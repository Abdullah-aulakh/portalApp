import { Repository } from "typeorm";
import { Enrollment } from "../entity/enrollment.entity";
import { EnrollmentStatus } from "../enum/enrollment.status";

export class EnrollmentService {
  constructor(private readonly enrollmentRepository: Repository<Enrollment>) {}

  async find(): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find();
  }

  async findById(id: string): Promise<Enrollment | null> {
    return await this.enrollmentRepository.findOne({
      where: { id },
    });
  }

  async createEnrollment(enrollment: Enrollment): Promise<Enrollment> {
    const newEnrollment = this.enrollmentRepository.create(enrollment);
    await this.enrollmentRepository.save(newEnrollment);
    return newEnrollment;
  }
  async delete(id: string): Promise<Boolean> {
    const result = await this.enrollmentRepository.delete(id);
    return result.affected !== 0;
  }
  async updateEnrollment(id: string, enrollmentData: Partial<Enrollment>): Promise<Enrollment | null> {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });
    if (!enrollment) return null;

    this.enrollmentRepository.merge(enrollment, enrollmentData);
    await this.enrollmentRepository.save(enrollment);
    return enrollment;
  }
  async findByStudentId(id: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
        where: { student: { id } },
    })
  }
  async findExistingEnrollment(studentId: string, courseId: string): Promise<Enrollment | null> {
    return await this.enrollmentRepository.findOne({
      where: { student: { id: studentId }, course: { id: courseId } },
    });
  }
  async findActiveEnrollments(studentId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { student: { id: studentId }, status: EnrollmentStatus.ENROLLED },
      relations:{
        course:{
          teacher:{
            user:true
          }
        }
      }
    });
  }
  async findPreviousEnrollments(studentId: string): Promise<Enrollment[]> {
    return await this.enrollmentRepository.find({
      where: { student: { id: studentId }, status: EnrollmentStatus.COMPLETED },
      relations:{
        course:{
          teacher:{
            user:true
          }
        }
      }
    });
  }
}