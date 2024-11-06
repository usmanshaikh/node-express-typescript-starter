import express from 'express';
import { userController } from '../controllers';
import { authenticateJWT } from '../middlewares';

const router = express.Router();

/* prettier-ignore-start */
router.get('/:id', authenticateJWT, userController.getUser);
/* prettier-ignore-end */

export default router;
