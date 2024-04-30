import { Request, Response, response } from 'express';
import  {bookingService}  from  '../services/bookingService';
import logger from '../utils/logger';

export const viewBooking = async (req:Request, res:Response)=> {
  try {
    const { id } = req.query as { id: string };
    const status = req.body.status || req.query.status;
    if(id || status){
      if(id){
      const response = await bookingService.viewBooking(id);
      if (!response) {
        return res.status(404).json({success:false,message:"No Booking Available"})
      }
      return res.status(200).json({success:true,data:response})
    }
    else{
      const response = await bookingService.viewBookingFilter({ status });
      if(!response){
        return res.status(404).json({success:false,message:"No Booking Available"})
      }
      return res.status(200).json({success:true,data:response,message:"all booking here.."})
    }
    }
    else{
      const response = await bookingService.viewBookingAll()
      if (!response) {
       return res.status(404).json({success:false,message:"No Booking Available"})
      }
      return res.status(200).json({success:true,data:response,message:"all booking here."})
    }
  } catch (error) {
    logger.error(error)
    return res.status(500).json({success:false,message:`Error in viewBooking:`+error})
  }
};

export const createBooking = async (req:Request, res:Response) => {
  try {
    const response = await bookingService.createBooking(req.body);
    if(!response){
      return res.status(404).json({success:false,message:'Enter Valid Field'})
    }
    await response.save();
    return res.status(200).json({success:true,data:response,message:"Ride booking successfully."})
  } catch (error) {
    logger.error(error)
    return res.status(500).json({success:false,message:`Error in createBooking:`+ error});
  }
};

export const updateBooking = async (req:Request, res:Response) => {
  try {
    const response = await bookingService.updateBooking(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!response) {
      return res.status(404).json({success:false,message:"Enter Valid Booking ID or Value"});
    }
    return res.status(200).json({success:true,data:response,message:"Booking updated successfully.."});
  } catch (error) {
    logger.error(error)
    return res.status(500).json({success:false,message:`Error in updateBooking:`+ error});
  }
};

export const deleteBooking = async (req:Request, res:Response) => {
  try {
    const response = await bookingService.deleteBooking(req.params.id);
    if (!response) {
      return res.status(404).json({success:false,message:"Enter valid Booking"});
    }
    return res.status(200).json({success:true,data:response,message:"Booking Cancel Suceesfully."});
  } catch (error) {
    logger.error(error)
    return res.status(500).json({success:false,message:`Error in deleteBooking:`+ error});
  }
};

export const getRevenue = async (req:Request, res:Response) => {
  try {
    const response = await bookingService.getRevenue();
    if (!response) {
      return res.status(404).json({success:false,message:"No Any Revenue Found "});
    }
    return res.status(200).json({success:true,data:response,message:"Generate total Revenue"});
  } catch (error) {
    logger.error(error)
    return res.status(500).json({success:false,message:`Error in getRevenue:`+ error});
  }
};

export const totalBooking = async (req:Request, res:Response) => {
  try {
    const response = await bookingService.aggregateBookings();
    if (!response) {
      return res.status(404).json({success:false,message:"No Any Booking Found "});
    }
    return res.status(200).json({success:true,data:response,message:"Generate total Booking"});
  } catch (error) {
    logger.error(error)
    return res.status(500).json({success:false,message:`Error in totalBooking: `+error});
  }
};
