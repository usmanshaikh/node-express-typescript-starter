import express from 'express';
import { authController } from '../controllers';
import { authValidation } from '../validations';
import { validate } from '../middlewares';

const router = express.Router();

router.post('/register',validate(authValidation.register),  authController.register);
router.post('/login',validate(authValidation.login),  authController.login);

export default router;
