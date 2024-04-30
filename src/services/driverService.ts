import { RootQuerySelector, UpdateQuery } from "mongoose";
import  driverSchema from '../models/driverModel';
import tempAuthSchema, {tempAuth} from "../models/tempAuthModal";
import logger from "../utils/logger";

const viewDriver = async () => {
  try {
    return await driverSchema.find();
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const viewDriverById = async (query: string) => {
  try {
    return await driverSchema.findById(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const deleteDriver = async (query: string) => {
  try {
    return await driverSchema.findByIdAndDelete(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const updateDriver = async (
  id:string,
  query: UpdateQuery<tempAuth>,
) => {
  try {
    return await driverSchema.findByIdAndUpdate(id, query, {new: true});
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const findDriver = async (query: RootQuerySelector<tempAuth>) => {
  try {
    return await driverSchema.findOne(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const registerUser = async (query: RootQuerySelector<tempAuth>) => {
  try {
    return await driverSchema.create(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const registeruserTemp = async (query: RootQuerySelector<tempAuth>) => {
  try {
    return await tempAuthSchema.create(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const findPhoneNumber = async (query: RootQuerySelector<tempAuth>) => {
  try {
    return await tempAuthSchema.findOne(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const removeTempUser = async (query: string) => {
  try {
    return await tempAuthSchema.findByIdAndDelete(query);
  } catch (error) {
    logger.error(error)
    throw error
  }
};

const availableDrivers = async () => {
  try {
    return await driverSchema.find({ availability:true })
  } catch (error) {
    logger.error(error)
    throw error;
  }
};

export const driverService = {
  viewDriver,
  viewDriverById,
  deleteDriver,
  updateDriver,
  findDriver,
  registerUser,
  registeruserTemp,
  findPhoneNumber,
  removeTempUser,
  availableDrivers
};