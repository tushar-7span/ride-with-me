import { driverService } from "../services/driverService";
import { vehicleService } from "../services/vehicleService";
import { Request, Response } from "express";
import { AWS_S3 } from "../helper/constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {client} from '../configs/awsS3Client'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const getDriver = async (req: Request, res: Response) => {
  try {
    const response = await driverService.viewDriver();
    if(!response){
      return res.status(404).json({
        success:false,
        message: "Unable to get list of Driver."
      })
    }
    else{
      return res.status(200).json({ 
        success: true, 
        data: response
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in GetDriver "+error,
    });
  }
};

export const getDriverByID = async (req: Request, res: Response) => {
  try {
    const response = await driverService.viewDriverById(req.params.id);
    if(!response){
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      })
    }
    else{
      return res.status(200).json({
        success: true,
        data: response
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in GetCustomer ID "+error,
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { model, year, licensePlate, vehicleClass } = req.body;
    const response = await vehicleService.updateVehicleDetails(id, {
      model,
      year,
      licensePlate,
      vehicleClass,
    });
    if(!response){
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      })
    }
    else{
      return res.status(200).json({
        success: true,
        data: response,
        message: "vehicle details updated Successfully."
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ERROR in Update Vehicle "+error,
    });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { name, email, verificationStatus } = req.body;
    const response = await driverService.updateDriver(req.params.id, {
      name,
      email,
      verificationStatus
    });
    if(!response){
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      })
    }
    else{
      return res.status(200).json({
        success: true,
        data: response,
        message: "Driver data updated Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ERROR in Update Driver "+error,
    });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const response = await driverService.deleteDriver(req.params.id);
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Invalid driverID",
      });
    }
    return res.status(200).json({
      success: true,
      data: response,
      message: "Driver deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const availableDrivers = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await driverService.availableDrivers();
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Not Available Any Driver" });
    }
    return res.status(200).json({
      success: true,
      data: response,
      message: "all available driver",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const imageUpload = async (req: Request, res: Response) => {
  try {
    const getPresignedUrl = async (client: S3Client) => {
      const fileName = Date.now().toString() + (Math.random()*100000).toFixed(0);
      const fileUrl = `https://${AWS_S3.NAME}.s3.${AWS_S3.REGION}.amazonaws.com/${fileName}`;
      const command = new PutObjectCommand({
        Bucket: AWS_S3.NAME,
        Key: fileName,
      });
      const preSignedUrl = await getSignedUrl(client, command);
      return {
        fileUrl,
        preSignedUrl,
      };
    };
    const count = req.query.count ?? 1;
    const presignedUrlArray = [];
    for (let index = 0; index < +count; index++) {
      presignedUrlArray.push(getPresignedUrl(client));
    }
    const presignedUrlResult = await Promise.allSettled(presignedUrlArray);
    const uploadUrls = [];
    for (const result of presignedUrlResult) {
      if (result.status === "fulfilled") {
        uploadUrls.push(result.value);
      }
    }
    return res.status(200).json({
      success: true,
      data: uploadUrls,
      message: "preSignedUrl Generated...",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "preSigned URL failed:" + error });
  }
};

export const addVehicleAndSaveImage = async (req: Request, res: Response) => {
  try {
    const { model, year, licensePlate, vehicleClass, driverId, imageUrls } = req.body;
    // Check if the vehicle already exists
    const vehicleExist = await vehicleService.findVehicle({ licensePlate });
    if (vehicleExist) {
      return res.status(500).json({
        success: false,
        message: "Already Registered Vehicle",
      });
    }
    // Add the vehicle
    const response = await vehicleService.addVehicle({
      model,
      year,
      licensePlate,
      vehicleClass,
      driverId,
      fare: 0,
      save: function (): unknown {
        throw new Error("Function not implemented.");
      },
    });
    await response.save();
    // Find the driver by ID
    const driver = await driverService.findDriver({ _id: driverId });
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    // Add each image URL to the driver's images array
    for (const imageUrl of imageUrls) {
      driver.images.push(imageUrl);
    }
    // Save the updated driver document
    await driver.save();
    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully, and image URLs saved",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding vehicle or saving image URLs: " + error,
    });
  }
};


// export const addVehicle = async (req: Request, res: Response) => {
//   try {
//     const { model, year, licensePlate, vehicleClass, driverId } = req.body;
//     const vehicleExist = await vehicleService.findVehicle({ licensePlate });
//     if (vehicleExist) {
//       return res.status(500).json({
//         success: false,
//         message: "Already Register Vehicle ",
//       });
//     }
//     const response = await vehicleService.addVehicle({
//       model,
//       year,
//       licensePlate,
//       vehicleClass,
//       driverId,
//       fare: 0,
//       save: function (): unknown {
//         throw new Error("Function not implemented.");
//       },
//     });
//     await response.save();
//     return res.status(201).json({
//       success: true,
//       data: response,
//       message: "vehicle added successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while addind vehicle " + error,
//     });
//   }
// };

// export const saveImageUrl = async (req: Request, res: Response) => {
//   try {
//     const { driverId, imageUrls } = req.body; // Assuming you pass driverId and imageUrls in the request body

//     // Find the driver by ID
//     const driver = await driverService.findDriver({ _id: driverId }); // Pass an object with the _id field

//     if (!driver) {
//       return res.status(404).json({ success: false, message: 'Driver not found' });
//     }

//     // Add each image URL to the driver's images array
//     for (const imageUrl of imageUrls) {
//       driver.images.push(imageUrl);
//     }

//     // Save the updated driver document
//     await driver.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Image URLs saved successfully',
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: 'Error saving image URLs: ' + error });
//   }
// };