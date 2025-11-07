// src/helpers/otp.helper.ts
import dotenv from "dotenv";
dotenv.config();
export const generateOtp = (length = 6): string => {
  const { ENV } = process.env;

  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // random digit
  }
  return otp;
};
