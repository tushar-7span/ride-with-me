import express from 'express';
const router = express()
import customerRoute from './customerRoute'

router.use("/user",customerRoute)

export default router