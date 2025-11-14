export class StudentResponseDto {
  id: string;
  registrationNumber: string;
  program: string;
  currentSemester: number;
  isEnrolled: boolean;

  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string | null;
    role: string;
  };

  department?: {
    id: string;
    name: string;
  };

  constructor(student: any) {
    this.id = student.id;
    this.registrationNumber = student.registrationNumber;
    this.program = student.program;
    this.currentSemester = student.currentSemester;
    this.isEnrolled = student.isEnrolled;

    // Optional user
    if (student.user) {
      this.user = {
        id: student.user.id,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email,
        profilePicture: student.user.profilePicture,
        role: student.user.role,
      };
    }

    // Optional department
    if (student.department) {
      this.department = {
        id: student.department.id,
        name: student.department.name,
      };
    }
  }
}
