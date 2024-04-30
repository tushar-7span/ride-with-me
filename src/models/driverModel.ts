import mongoose, { Document } from 'mongoose';
import Joi from 'joi';

export interface ImageObject {
  name: string;
  imageUrl: string;
}
export interface driver extends Document {
  name: string;
  email: string; 
  phoneNumber: string; 
  availability: boolean;
  role: string; 
  token: string; 
  isVerified: boolean;
  images: ImageObject[];
}

const driverSchema = new mongoose.Schema<driver>({
  name: {
    type: String,
    required:true
  },
  email: {  
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  role:{
    type: String,
    enum: ["admin", "driver", "user"],
    default: 'driver'
  },
  availability: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  images: [
    {
      name: { type: String, required: true },
      imageUrl: { type: String, required: true }
    }
  ],
});

const phonePattern = /^(0|91)?[6-9][0-9]{9}$/
export const driverJoiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(10).regex(phonePattern).required(),
  role: Joi.string().default('driver'),
});

export const updateDriverSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  role: Joi.string(),
});


export default mongoose.model<driver>("driver", driverSchema);