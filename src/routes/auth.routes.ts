import express from 'express';
import { authController } from '../controllers';
import { authValidation } from '../validations';
import { validate } from '../middlewares';

const router = express.Router();

/* prettier-ignore-start */
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
/* prettier-ignore-end */

export default router;
