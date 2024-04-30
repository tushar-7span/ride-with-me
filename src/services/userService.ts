import { QueryOptions, RootQuerySelector, UpdateQuery } from "mongoose";
import CustomerSchema, { Customer } from "../models/customerModel";
import tempAuthSchema, {tempAuth} from "../models/tempAuthModal";
import logger from "../utils/logger";

const viewCustomer = async () => {
  try {
    return await CustomerSchema.find();
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const viewCustomerById = async (query: string) => {
  try {
    return await CustomerSchema.findById(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const deleteCustomer = async (query: string) => {
  try {
    return await CustomerSchema.findByIdAndDelete(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const updateCustomer = async (
  id:string,
  query: UpdateQuery<Customer>,
) => {
  try {
    return await CustomerSchema.findByIdAndUpdate(id, query, {new: true});
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const findCustomer = async (query: RootQuerySelector<Customer>) => {
  try {
    return await CustomerSchema.findOne(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const registerUser = async (query: RootQuerySelector<Customer>) => {
  try {
    return await CustomerSchema.create(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const registeruserTemp = async (query: RootQuerySelector<Customer>) => {
  try {
    return await tempAuthSchema.create(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const findPhoneNumber = async (query: RootQuerySelector<Customer>) => {
  try {
    return await tempAuthSchema.findOne(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

const removeTempUser = async (query: string) => {
  try {
    return await tempAuthSchema.findByIdAndDelete(query);
  } catch (error) {
    logger.error(error);
    throw error
  }
};

export const customerService = {
  viewCustomer,
  viewCustomerById,
  deleteCustomer,
  updateCustomer,
  findCustomer,
  registerUser,
  registeruserTemp,
  findPhoneNumber,
  removeTempUser
};
