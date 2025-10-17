import "reflect-metadata";
import  express from "express";
import { AppDataSource } from "./config/data-source";
import { userRouter} from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);


AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
