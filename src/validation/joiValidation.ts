import { NextFunction,Request,Response } from 'express';
import { bookingJoiSchema} from '../models/bookingModel';
import logger from '../utils/logger'
import {ValidationResult,Schema}from 'joi';
// import { driverJoiSchema } from '../models/driverModel';
// import { customerJoiSchema } from '../models/customerModel';

const schemas:Record<string,Schema> = {
  booking:bookingJoiSchema,
  // driver:driverJoiSchema,
  // user:userJoiSchema
}
interface validateDataInput{
  property1:string,
  property2:number
}
const validateData = (model:string,data:validateDataInput):ValidationResult=>{
  const schema = schemas[model];
    if (!schema) {
        throw new Error("Schema not found for validation..")
    }
    return schema.validate(data)
}

export const validateRequest = (req:Request, res:Response, next:NextFunction) => { 
  try {
    const {error} = validateData(req.originalUrl.split('/').at(3) || "",req.body)
  if (error) {
    return res.status(500).json({success:false,message:"joischema validation error"+error.details[0].message})
   } 
next()
} catch (error) {
    logger.error(error);
  }
};
