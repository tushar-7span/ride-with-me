import { Router } from 'express';
const router = Router()

import {
 viewBooking,createBooking,updateBooking,deleteBooking,getRevenue,totalBooking
} from '../controllers/bookingController';
import {validateRequest} from '../validation/joiValidation';

router.post("/",validateRequest,createBooking);
router.get("/list", viewBooking);
router.get("/revenue", getRevenue);
router.get("/total",totalBooking)
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;