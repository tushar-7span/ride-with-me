import { Request, Response } from "express";
import { customerService } from "../services/userService";
import { TWILIO } from "../helper/constants";
import twilio from "twilio";
import jwtToken from "../validation/jwtToken";
import radiusCalc from "../utils/radiusCalc";
import { driverService } from "../services/driverService";
import logger from "../utils/logger";
import { sendRequestToDriver } from "../utils/sendRequest";
import { sendOtp } from "../utils/sendOtp";
const client = twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, role, location } = req.body;
    if (!name || !email || !phoneNumber || !role) {
      logger.error("Invalid Details")
      return res.status(404).json({ 
        success: false, 
        message: "Enter valid details." });
    }
    const userExist = await customerService.findCustomer({ phoneNumber });
    if (userExist) {
      logger.error("Existing User")
      return res
        .status(400)
        .json({
          success: false, 
          message: "User Already exist." 
        });
    }
    if (role !== "admin") {
      const response = await customerService.registeruserTemp({
        name,
        email: email.toLowerCase(),
        phoneNumber,
        role,
        location,
      });
      if (!response) {
        logger.error("Invalid User")
        return res.status(400).json({
          success: false,
          message: "Invalid Data",
        });
      }
      const otpResponse = await sendOtp(phoneNumber);
      if (!otpResponse.success) {
        logger.error("OTP response failed")
        return res.status(400).json({
          success: false,
          message: "Failed OTP response",
        });
      }
      await response?.save();
      logger.info("OTP sent to corresponding mobile number!")
      return res.status(200).json({
        success: true,
        message: "OTP sent Please verify within 10 minutes",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Role Should not be selected as Admin",
      });
    }
  } catch (error) {
    logger.error("Error occured at signing up! ",error)
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber && !otp) {
    logger.error("Invalid Phone number and OTP")
    return res.status(404).json({
      success: false,
      message: "Please Enter Phone number and otp",
    });
  }
  try {
    const response = await client.verify.v2
      .services(TWILIO.SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otp,
      });
    switch (response.status) {
      case "approved":{
      const existUserTemp = await customerService.findPhoneNumber({
        phoneNumber,
     });
      if (existUserTemp) {
        const newUser = await customerService.registerUser({
          name: existUserTemp.name,
          email: existUserTemp.email,
          phoneNumber: existUserTemp.phoneNumber,
          role: existUserTemp.role,
          location: existUserTemp.location,
        });
        await newUser?.save();
        await customerService.removeTempUser(existUserTemp.id);
      }
      logger.info("User Created & Registered in Database successfullly")
      return res.status(200).json({
        success: true,
        message: "Successfully Verified and Registered ",
      });
    }
      default:
        logger.error("Invalid otp while verifying fr signup")
        return res.status(400).json({
          success: false,
          message: "Invalid OTP. Please try again.",
        });
    }
  } catch (error) {
    logger.error("Internal Server Error", error)
    return res.status(500).json({
      success: false,
      message: "Invalid OTP ENTERED" + error,
    });
  }
};

const sendLoginOtp = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    logger.error("Invalid Phone number")
    return res.status(404).json({
      success: false, 
      message: "Enter PhoneNumber"
    });
  }
  const lastDigit = phoneNumber.substring(6, 10);
  const registeredUser = await customerService.findCustomer({ phoneNumber });
  if (!registeredUser) {
    logger.error("No registered user found")
    return res.status(404).json({
      success: false,
      message: `No user exist with such ${phoneNumber} please Sign-Up first!!`,
    });
  } else {
    try {
      await client.verify.v2.services(TWILIO.SERVICE_SID).verifications.create({
        to: `+91${phoneNumber}`,
        channel: "sms",
      });
      logger.info(`Otp successfully sent to xxxxxx${lastDigit}`)
      return res.status(200).json({
        success: true,
        message: `OTP successfully sent to mobile Number ending with ${lastDigit}`,
      });
    } catch (error) {
      logger.error("Error occured while sending otp ",error)
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }
};

const login = async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    logger.error("Enter valid phone number and otp")
    return res.status(404).json({
      success: false,
      message: "Please Enter valid phone number and otp",
    });
  }
  try {
    const response = await client.verify.v2
      .services(TWILIO.SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otp,
      });

    switch (response.status) {
      case "approved":{
        const existUser = await customerService.findCustomer({ phoneNumber });
        if (!existUser) {
          logger.error("No user found")
          return res.status(400).json({
            success: false,
            message: "Oops!! Sign-Up first",
          });
        } else {
          const token = jwtToken(existUser);
          existUser.token = token;          
          return res
            .cookie("token", token, {
              maxAge: 3 * 24 * 60 * 60 * 1000,
              httpOnly: true,
            })
            .status(200)
            .json({
              success: true,
              message: "User Logged in successfully",
            });
        }}
      default:
        logger.error("OTP enetered is invalid")
        return res.status(400).json({
          success: false,
          message: "Invalid OTP. Please try again.",
        });
    }
  } catch (error) {
    logger.error("Error occured at Login ", error)
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const requestDrive = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userLocation = await customerService.findLocationByIdUser(
      req.params.id
    );
    if (!userLocation) {
      logger.error("User object not found!")
      return res.status(404).json({
        success: false,
        message: "User location not found.",
      });
    }
    const latU = userLocation.location.coordinates[0];
    const longU = userLocation.location.coordinates[1];
    if(!latU && !latU){
      logger.error("LAT AND LONG UNDEFINED OR NOT FOUND!")
      return res.status(404).json({
        success: false,
        message: "LAT AND LONG UNDEFINED OR NOT FOUND!"
      })
    }

    const availableDrivers = await driverService.availableDrivers();

    if (!availableDrivers) {
      logger.error("NO AVAILABLE DRIVERS FOUND!")
      return res.status(404).json({
        success: false,
        message: "No available drivers found.",
      });
    }
    for (const driver of availableDrivers) {
      const latD = driver.location.coordinates[0];
      const longD = driver.location.coordinates[1];

      if(!latD && !latD){
        logger.error("LAT AND LONG UNDEFINED OR NOT FOUND!")
        return res.status(404).json({
          success: false,
          message: "LAT AND LONG UNDEFINED OR NOT FOUND!"
        })
      }

      const Radius = radiusCalc(latU, longU, latD, longD);
      if (Radius < 2) {
        const {name, location} = userLocation;
        await sendRequestToDriver(driver.name, {name, location} );
      }
      else{
        return res.json({
          success: false,
          messaag: "No Available drivers found under 2 km radius"
        })
      }
    }
    logger.info("REQUEST SEND TO DRIVER WITHIN 2 KM RADIUS")
    return res.status(200).json({
      success: true,
      message: "Requests sent to nearby drivers.",
    });
  } catch (error) {
    logger.error("An error occurred while processing the request. ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

export { signUp, verifyOtp, sendLoginOtp, login, requestDrive };

// import { Request, Response } from "express";
// import { customerService } from "../services/userService";

// // Static phone number and OTP
// const STATIC_PHONE_NUMBER = "9999999999";
// const STATIC_OTP = "9999";

// const signUp = async (req: Request, res: Response) => {
//   try {
//     const { name, email, phoneNumber, role, location } = req.body;
//   if (!name || !email || !phoneNumber || !role || !location) {
//     return res
//       .status(200)
//       .json({ success: false, message: "Enter valid details." });
//   }
//   const userExist = await customerService.findCustomer({ phoneNumber });
//   if (userExist) {
//     return res
//       .status(200)
//       .json({ success: false, message: "User Already exist." });
//   }
//   if (role !== "admin") {
//     const response = await customerService.registeruserTemp({
//       name,
//       email: email.toLowerCase(),
//       phoneNumber,
//       role,
//       location,
//     });
//     if (!response) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Data",
//       });
//     }
//     return res.json({
//       success: true,
//       data: response,
//       message: "OTP sent successfully"
//     })
//   }
//   } catch (error) {
//     return res.json({
//       success: false,
//       message:"Error at signing up "+ error
//     })
//   }
// };
// const verifyOtp = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;

//   // Check if the provided phone number and OTP match the static values
//   if (phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP) {
//     // Perform user registration or any other necessary actions here
//     return res.status(200).json({
//       success: true,
//       message: "OTP successfully verified",
//     });
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid phone number or OTP",
//     });
//   }
// };

// const sendLoginOtp = async (req: Request, res: Response) => {
//   const { phoneNumber } = req.body;

//   // Check if the provided phone number matches the static value
//   if (phoneNumber === STATIC_PHONE_NUMBER) {
//     // Simulate OTP sent
//     return res.status(200).json({
//       success: true,
//       message: "OTP successfully sent",
//     });
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid phone number",
//     });
//   }
// };

// const login = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;
//   if (!phoneNumber || !otp) {
//     return res.json({
//       success: false,
//       message: "Enter Valid details",
//     });
//   }
//   try {
//     if(phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP)
//     return res.json({
//       success: true,
//       message: "successfully logged in",
//     });
//   } catch (error) {
//     return res.json({
//       success: false,
//       message: error,
//     });
//   }
// };

// export { signUp, verifyOtp, sendLoginOtp, login };