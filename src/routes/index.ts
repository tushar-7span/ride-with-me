import express from 'express';
const router = express()

import customerRoute from './customerRoute'
import driverRoute from './driverRoute'
import bookingRoute from './bookingRoute'
// import { verifyToken } from '../middleware/authMiddleware';

router.use("/driver",driverRoute)
router.use("/user",customerRoute)
router.use("/booking",bookingRoute)

export default router