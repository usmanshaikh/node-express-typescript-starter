import express from 'express';
import { userController } from '../controllers';
import { authenticateJWT, validate } from '../middlewares';
import { userValidation } from '../validations';

const router = express.Router();

router
  .route('/:userId')
  .get(authenticateJWT, userController.getUser)
  .delete(authenticateJWT, userController.deleteUser)
  .patch(authenticateJWT, validate(userValidation.updateUser), userController.updateUser);

export default router;
