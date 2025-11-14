import "reflect-metadata";
import  express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./config/data-source";
import { userRouter} from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { otpRouter } from "./routes/otp.routes";
import { departmentRouter } from "./routes/department.routes";
import {timetableRouter} from "./routes/timetable.routes";
import { teacherRouter } from "./routes/teacher.routes";
import { studentRouter } from "./routes/student.routes";
import { gradeRouter } from "./routes/grade.routes";
import { adminRouter } from "./routes/admin.routes";
import { enrollmentRouter } from "./routes/enrollment.routes";
import {courseRouter} from "./routes/courses.routes";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


// Allow frontend running on localhost:5173 to access (adjusted per request).
// We enable credentials so cookies can be set from the server.
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/timetables", timetableRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/students", studentRouter);
app.use("/api/admin",adminRouter)
app.use("/api/grades", gradeRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/courses", courseRouter);

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

