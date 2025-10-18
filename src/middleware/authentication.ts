import { NextFunction, Request, Response } from "express";
import Encrypt from "../helpers/encrypt.helper";
import { tokenRepository } from "../repository";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = Encrypt.verifyToken(token);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const existance = await tokenRepository.findOne(token);
  if (!existance) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.headers["user"] = decode;
  next();
};