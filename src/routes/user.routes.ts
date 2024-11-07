import express from 'express';
import { userController } from '../controllers';
import { authenticateJWT, validate } from '../middlewares';
import { userValidation } from '../validations';

const router = express.Router();
  
router
  .route('/:userId')
  .get(authenticateJWT, validate(userValidation.getUser), userController.getUser)
  .patch(authenticateJWT, validate(userValidation.updateUser), userController.updateUser)
  .delete(authenticateJWT, validate(userValidation.deleteUser), userController.deleteUser);

export default router;
