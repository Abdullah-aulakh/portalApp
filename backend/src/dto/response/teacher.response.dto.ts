import { Teacher } from "../../entity/teacher.entity";
export class TeacherResponseDto {
  id: string;
  designation: string;
  position: string;
  experienceYears: number;
  qualification: string;
  
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string | null;
    role: string | null;
  };

  department: {
    id: string;
    name: string;
  };
  constructor(teacher: Teacher) {
    this.id = teacher.id;
    this.designation = teacher.designation;
    this.position = teacher.position;
    this.experienceYears = teacher.experienceYears;
    this.qualification = teacher.qualification;

    this.user = {
      id: teacher.user.id,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      profilePicture: teacher.user.profilePicture,
      role: teacher.user.role,
    };

    this.department = {
      id: teacher.department.id,
      name: teacher.department.name,
    };
    
  }
}
