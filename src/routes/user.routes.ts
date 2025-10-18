import express from "express";
import { authentication } from "../middleware/authentication";
import { UserController } from "../controllers/user.controller";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";

const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),UserController.getAllUsers);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),UserController.getUserById);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),UserController.deleteUserById);
// Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),UserController.updateUserById);

export { Router as userRouter };