import { NextFunction, Request, Response } from "express";
import Encrypt from "../helpers/encrypt.helper";
import { tokenRepository } from "../repository";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prefer cookie-based token (accessToken). Fall back to Authorization header.
  const cookieToken = (req as any)?.cookies?.accessToken;
  const header = req.headers.authorization;
  console.log("Auth Header:", header, "Cookie Token:", !!cookieToken);

  let token: string | undefined = undefined;
  if (cookieToken) token = cookieToken;
  else if (header) token = header.split(" ")[1];
  console.log("Using Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decode = Encrypt.verifyToken(token);
  console.log("Decoded Token:", decode);
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