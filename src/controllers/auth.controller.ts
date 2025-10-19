import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { userRepository } from "../repository";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user.entity";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export class AuthController {
  static register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role } = req.body;
    const existing = await userRepository.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const userRepo = AppDataSource.getRepository(User);
    const user = userRepo.create({ email, password: hashed, firstName, lastName, role });
    await userRepo.save(user);
    res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, role: user.role });
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  };
}
