import express from 'express';
import userRoute from './user';

const router = express.Router();

/* Setup /user endpoint */
router.use('/user', userRoute);

export default router;
