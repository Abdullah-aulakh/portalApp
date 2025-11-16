import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

import { authentication } from '../middleware/authentication';
import { authorization } from '../middleware/authorization';
import { UserRoles } from '../enum/user.roles';


const adminRouter = Router();

adminRouter.get('/dashboard', authentication,authorization([UserRoles.ADMIN]),AdminController.getDashboard);
adminRouter.get('/', authentication,authorization([UserRoles.ADMIN]),AdminController.getAdmin);

export { adminRouter };