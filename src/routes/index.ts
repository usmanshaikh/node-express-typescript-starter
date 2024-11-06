import express from 'express';
import authRoute from './auth.routes';
import userRoute from './user.routes';
import statusRoute from './status.routes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/status',
    route: statusRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
