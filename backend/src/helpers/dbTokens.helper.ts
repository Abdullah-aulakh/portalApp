import { Token } from "../entity/token.entity";
import { User } from "../entity/user.entity";
import { tokenRepository } from "../repository";

export const generateDbTokens = async (user: User, token: string, refreshToken: string) => {

    const dbToken = new Token();
        dbToken.token = token;
        dbToken.user = user;
        dbToken.expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); 
    
        await tokenRepository.createToken(dbToken);
    
        const dbRefreshToken = new Token();
        dbRefreshToken.token = refreshToken;
        dbRefreshToken.user = user;
        dbRefreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await tokenRepository.createToken(dbRefreshToken);
}