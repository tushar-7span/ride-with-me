import { Router } from "express";
const router = Router();

import {
  getCustomer,
  getCustomerByID,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import { signUp, verifyOtp, sendLoginOtp, login  } from "../controllers/userAuthController";
import {validateRequest} from "../validation/joiValidation";
import { verifyToken } from "../middleware/authMiddleware";

router.post("/register", validateRequest, signUp);
router.post("/verify-otp", verifyOtp);
router.get("/", getCustomer);
router.get("/:id", getCustomerByID);
router.put("/:id", verifyToken,updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/send-login-otp", sendLoginOtp);
router.post("/login", login);
// router.get("/maps/distance", calcDistance);

export default router;