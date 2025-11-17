import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { User } from "../entity";

const attendanceRouter = Router();
attendanceRouter.post("/createOrUpdate",authentication,authorization([UserRoles.ADMIN,UserRoles.TEACHER]),
AttendanceController.updateAttendance);
attendanceRouter.get("/today/:id",authentication,authorization([UserRoles.ADMIN,UserRoles.TEACHER]),
AttendanceController.getTodaysAttendance);
attendanceRouter.get("/student/reg/:registrationNumber", authentication,authorization([UserRoles.ADMIN]),
AttendanceController.getStudentAttendanceData);
attendanceRouter.put("/",authentication,authorization([UserRoles.ADMIN]),AttendanceController.updateAttendance);

export { attendanceRouter };