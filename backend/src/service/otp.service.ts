import { Repository } from "typeorm";
import { Otp } from "../entity/otp.entity";

export class OtpService {
  constructor(private otpRepository: Repository<Otp>) {}


  async findByEmail(email: string): Promise<Otp | null> {
    return await this.otpRepository.findOneBy({ email });
  }

  async findOne (otp: string,email: string): Promise<Otp | null> {
    return await this.otpRepository.findOneBy({ otp, email });
  }

  async createOtp(otp: Partial<Otp>): Promise<Otp> {
    const newOtp = this.otpRepository.create({
        ...otp,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 5),
    });
    await this.otpRepository.save(newOtp);
    return newOtp;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.otpRepository.delete({ id });
    return result.affected !== 0;
  }
  async update(id: number, otp: Partial<Otp>): Promise<Otp | null> {
    const otpRecord = await this.otpRepository.findOneBy({ id });
    if (!otpRecord) return null;

    this.otpRepository.merge(otpRecord, otp);
    await this.otpRepository.save(otpRecord);
    return otpRecord;
  }
}