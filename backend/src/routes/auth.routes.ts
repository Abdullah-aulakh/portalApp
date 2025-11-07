import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { verifyAccountLimiter,resetPasswordLimiter } from '../helpers/rate.limiter.helper';
import { authentication } from '../middleware/authentication';
import { authorization } from '../middleware/authorization';
import { UserRoles } from '../enum/user.roles';
import { userValidator } from '../validators';

const authRouter = Router();

authRouter.post('/login', AuthController.loginUser);
authRouter.post('/create',authentication,authorization([UserRoles.ADMIN]),userValidator,AuthController.createUser);
authRouter.post('/refresh-token', AuthController.refreshToken);
authRouter.post('/reset-password', AuthController.resetPassword);
authRouter.post('/logout', authentication,AuthController.logoutUser);

export { authRouter };