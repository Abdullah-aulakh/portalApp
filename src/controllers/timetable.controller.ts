import { Request, Response } from "express";
import { timetableRepository} from "../repository/index";
import { catchAsync } from "../helpers/catch-async.helper";


export class TimetableController {
  
  static getAllTimetables = catchAsync(async (req: Request, res: Response) => {
    const timetables = await timetableRepository.find();
    res.status(200).json(timetables);
  });
  static getTimetableById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const timetable = await timetableRepository.findById(id);
    if (!timetable) return res.status(404).json({ message: "Timetable not found" });
    res.status(200).json(timetable);
  });

  static deleteTimetableById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const timetable = await timetableRepository.findById(id);
    if (!timetable) return res.status(404).json({ message: "Timetable not found" });

    await timetableRepository.delete(id);
    res.status(200).json({ message: "Timetable deleted successfully" });
  });

  static updateTimetableById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const timetable = await timetableRepository.findById(id);
    if (!timetable) return res.status(404).json({ message: "Timetable not found" });

    const updatedTimetable = await timetableRepository.updateTimetable(id, req.body);
    res.status(200).json(updatedTimetable);
  });

  static createTimetable = catchAsync(async (req: Request, res: Response) => {
    const timetable = await timetableRepository.createTimetable(req.body);
    res.status(201).json(timetable);
  });
}   