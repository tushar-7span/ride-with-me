import  vehicleDetails  from '../models/vehicleDetails';

const findVehicle = async (query: any) => { 
  try {
    return await vehicleDetails.findOne(query);
  } catch (error) {
    throw error;
  }
};

const addVehicle = async (query: any) => {
  try {
    return await vehicleDetails.create(query);
  } catch (error) {
    throw error;
  }
};

const updateVehicleDetails = async (id: string, query: any) => {
  try {
    return await vehicleDetails.findByIdAndUpdate(id, query);
  } catch (error) {
    throw error;
  }
};

export const vehicleService =  {findVehicle,addVehicle,updateVehicleDetails}