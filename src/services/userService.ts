import { RootQuerySelector, UpdateQuery } from "mongoose";
import CustomerSchema, { Customer } from "../models/customerModel";
import tempAuthSchema from "../models/tempAuthModal";

const viewCustomer = async () => {
  return await CustomerSchema.find();
};

const viewCustomerById = async (query: string) => {
  return await CustomerSchema.findById(query);
};

const deleteCustomer = async (query: string) => {
  return await CustomerSchema.findByIdAndDelete(query);
};

const updateCustomer = async (
  id:string,
  query: UpdateQuery<Customer>,
) => {
  return await CustomerSchema.findByIdAndUpdate(id, query, {new: true});
};

const findCustomer = async (query: RootQuerySelector<Customer>) => {
  return await CustomerSchema.findOne(query);
};

const registerUser = async (query: RootQuerySelector<Customer>) => {
  return await CustomerSchema.create(query);
};

const registeruserTemp = async (query: RootQuerySelector<Customer>) => {
  return await tempAuthSchema.create(query);
};

const findPhoneNumber = async (query: RootQuerySelector<Customer>) => {
  return await tempAuthSchema.findOne(query);
};

const removeTempUser = async (query: string) => {
  return await tempAuthSchema.findByIdAndDelete(query);
};

const findLocationByIdUser = async(query: string) => {
  return await CustomerSchema.findById(query)
}

const findAvailableDrivers = async(query: string) => {
  return await CustomerSchema.findById(query)
}

const availableDrivers = async () => {
  return await CustomerSchema.find({ availibility:true }).select('location').select('coordinates')
};

const updateLoc = async (id: string, update: UpdateQuery<Customer>): Promise<Customer | null> => {
  return await CustomerSchema.findOneAndUpdate({ _id: id }, update, { new: true });
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
  removeTempUser,
  findLocationByIdUser,
  findAvailableDrivers,
  availableDrivers,
  updateLoc
};