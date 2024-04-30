import express from 'express';
const router = express()

import bookingRoute from './bookingRoute'
// import { verifyToken } from '../middleware/authMiddleware';

router.use("/booking",bookingRoute)

export default router