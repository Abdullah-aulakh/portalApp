import { Repository } from "typeorm";
import { Token } from "../entity/token.entity";

export class TokenService {
  constructor(private tokenRepository: Repository<Token>) {}

async findAllUserTokens(userId: string): Promise<Token[]> {
  return this.tokenRepository.find({
    where: { user: { id: userId } },
    relations: ["user"],
  });
}

async findOne(token:string): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: { token },
      relations: ["user"],
    });
  }

  async findById(id: string): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async createToken(token: Token): Promise<Token> {
    const newToken = this.tokenRepository.create(token);
    await this.tokenRepository.save(newToken);
    return newToken;
  }
  async delete(token: string): Promise<boolean> {

    const result = await this.tokenRepository.delete({token:token});
 
    return result.affected !== 0;
  }
}