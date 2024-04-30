import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Update Driver Schema
const updateDriverSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  role: Joi.string(),
});

const validateUpdateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateDriverSchema.validate(req.body);
  if (error) {
    return res.status(200).json({
      success: false, 
      message: error.details[0].message
    });
  }
  next();
};

// Update Vehicle Schema

const updateVehicleSchema = Joi.object({
  manufacturer: Joi.string(),
  model: Joi.string(),
  year: Joi.string().min(4).max(4),
  licensePlate: Joi.string(),
  color: Joi.string(),
  vehicleClass: Joi.string()
    .valid("Bike", "Rickshaw", "Mini", "Premius", "XL")
    .required(),
});

const validateUpdateVehicle = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateVehicleSchema.validate(req.body);
  if (error) {
    return res.status(403).json({ error: error.details[0].message });
  }
  next();
};


export { validateUpdateRequest, validateUpdateVehicle };