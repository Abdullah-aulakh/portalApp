import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";

const attendanceRouter = Router();

attendanceRouter.get("/student/reg/:registrationNumber", authentication,authorization([UserRoles.ADMIN]),AttendanceController.getStudentAttendanceData);
attendanceRouter.put("/",authentication,authorization([UserRoles.ADMIN]),AttendanceController.updateAttendance);

export { attendanceRouter };