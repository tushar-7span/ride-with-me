import { Router } from "express";
const router = Router();
import {
  getCustomer,
  // getCustomerByID,
  updateCustomer,
  deleteCustomer } from "../controllers/customerController";
import { 
  signUp, 
  verifyOtp, 
  sendLoginOtp, 
  login, 
  requestDrive } from "../controllers/userAuthController";
import validateRequest from "../validation/userValidation";
import { verifyToken } from "../middleware/authMiddleware";
import calcDistance from "../utils/distance";

router.post("/register", validateRequest, signUp);
router.post("/verify-otp", verifyOtp);
router.post("/send-login-otp", sendLoginOtp);
router.post("/login", login);
router.get("/maps/distance", calcDistance);
router.get("/:id?", getCustomer);
router.put("/:id", verifyToken,updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/request-drive/:id", requestDrive)

export default router;