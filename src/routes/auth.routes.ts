import * as express from "express";
import { AuthController } from "../controllers/auth.controller";

const Router = express.Router();

Router.post("/auth/register", AuthController.register);
Router.post("/auth/login", AuthController.login);

export { Router as authRouter };
