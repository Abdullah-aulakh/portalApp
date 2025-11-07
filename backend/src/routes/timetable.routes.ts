import express from "express";
import { authentication } from "../middleware/authentication";
import { authorization } from "../middleware/authorization";
import { UserRoles } from "../enum/user.roles";
import { TimetableController } from "../controllers/timetable.controller"
import { timetableValidator } from "../validators/timetable.validator";
const Router = express.Router();

Router.get("/", authentication,authorization([UserRoles.ADMIN]),TimetableController.getAllTimetables);
Router.post("/", authentication,authorization([UserRoles.ADMIN]), timetableValidator,TimetableController.createTimetable);
Router.get("/:id", authentication,authorization([UserRoles.ADMIN]),TimetableController.getTimetableById);
Router.delete("/:id", authentication,authorization([UserRoles.ADMIN]),TimetableController.deleteTimetableById);
Router.put("/:id", authentication,authorization([UserRoles.ADMIN]),TimetableController.updateTimetableById);    

export { Router as timetableRouter };