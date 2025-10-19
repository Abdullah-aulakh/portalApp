import "reflect-metadata";
import  express from "express";
import { AppDataSource } from "./config/data-source";
import { userRouter} from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { otpRouter } from "./routes/otp.routes";
import { departmentRouter } from "./routes/department.routes";
import {timetableRouter} from "./routes/timetable.routes";
import { teacherRouter } from "./routes/teacher.routes";
import { studentRouter } from "./routes/student.routes";
import { gradeRouter } from "./routes/grade.routes";
import { courseRouter } from "./routes/courses.routes";
import { enrollmentRouter } from "./routes/enrollment.routes";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/timetables", timetableRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/students", studentRouter);
app.use("/api/courses", courseRouter);
app.use("/api/grades", gradeRouter);
app.use("/api/enrollments", enrollmentRouter);


AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
