import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const phonePattern = /^(0|91)?[6-9][0-9]{9}$/

const userJoiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(10).regex(phonePattern).required(),
  role: Joi.string(),
  location: Joi.object()
});

const validateRequest = (req: Request, res: Response, next: NextFunction,) => {
  const { error } = userJoiSchema.validate(req.body);
  if (error) {
    return res.status(404).json({
      success: false, 
      message: error.details[0].message
    });
  }
  next();
};

export default validateRequest;