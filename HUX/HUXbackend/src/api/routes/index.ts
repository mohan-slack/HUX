import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

router.get('/', (req: import('express').Request, res: import('express').Response) => {
  res.json({ message: 'Welcome to the HUX Backend API' });
});

router.use('/users', userRoutes);

export default router; 