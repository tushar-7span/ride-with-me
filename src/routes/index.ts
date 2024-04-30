import express from 'express';
const router = express()

import driverRoute from './driverRoute'

router.use("/driver",driverRoute)

export default router