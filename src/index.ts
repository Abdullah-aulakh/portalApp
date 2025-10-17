import "reflect-metadata";
import  express from "express";
import { AppDataSource } from "./config/data-source";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());



AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
