import { RootQuerySelector, UpdateQuery } from "mongoose";
import  driverSchema from '../models/driverModel';
import tempAuthSchema, {tempAuth} from "../models/tempAuthModal";

const viewDriver = async () => {
    return await driverSchema.find()
};

const viewDriverById = async (query: string) => {
  return await driverSchema.findById(query);
};

const deleteDriver = async (query: string) => {
    return await driverSchema.findByIdAndDelete(query);
};

const updateDriver = async (
  id:string,
  query: UpdateQuery<tempAuth>,
) => {
    return await driverSchema.findByIdAndUpdate(id, query, {new: true});
};

const findDriver = async (query: RootQuerySelector<tempAuth>) => {
    return await driverSchema.findOne(query);
};

const registerUser = async (query: RootQuerySelector<tempAuth>) => {
    return await driverSchema.create(query);
};

const registeruserTemp = async (query: RootQuerySelector<tempAuth>) => {
    return await tempAuthSchema.create(query);
};

const findPhoneNumber = async (query: RootQuerySelector<tempAuth>) => {
    return await tempAuthSchema.findOne(query);
};

const removeTempUser = async (query: string) => {
    return await tempAuthSchema.findByIdAndDelete(query);
};

const availableDrivers = async () => {
    return await driverSchema.find({ availability:true }).select('name').select('phoneNumber')
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