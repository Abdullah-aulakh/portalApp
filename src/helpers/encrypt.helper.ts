import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET = "", SALT_ROUNDS=10 } = process.env;

export default class Encrypt {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    return bcrypt.hashSync(password, salt);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
  }

  static async generateToken(
    payload: object,
    expiryTime: string = "1h"
  ): Promise<string> {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const secret: Secret = JWT_SECRET as Secret;

    const options: SignOptions = {
      expiresIn: expiryTime as any,
    };

    return jwt.sign(payload, secret, options);
  }

  static async generateRefreshToken(payload: any): Promise<string> {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}