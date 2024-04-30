import { Request, Response } from "express";
import cron from 'node-cron';
import { customerService } from '../services/userService';
import logger from "./logger";

const initScheduleJobs = async () => {
  const scheduledJobFunction = cron.schedule('*/10 * * * * *', () => {
    // console.log('running a task every 10 seconds');
  });
  scheduledJobFunction.start();
}

async function locUpdater(req: Request, res: Response) {
  const { currentLat, currentLong } = req.params;
  const update = {
    location: {
      type: "Point",
      coordinates: [parseFloat(currentLong), parseFloat(currentLat)],
    },
  };
  try {
    const updatedCustomer = await customerService.updateLoc(req.params.id, update);
    logger.info("UPDATING LOCATION WAS SUCCESS")
    res.status(200).json({
      success: true,
      data: updatedCustomer,
      message: "Updated successfullly"
    });
  } catch (error) {
    logger.error("ERROR OCCURED AT LOCATION UPDATER FUNCTION ", error)
    res.status(500).json({ 
      message: "Internal Server Error "+error 
    });
  }
} 

export {initScheduleJobs, locUpdater}