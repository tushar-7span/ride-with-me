// import { Request, Response, response } from 'express';
// import  {driverService}  from '../services/driverService';
// import { TWILIO } from "../helper/constants";
// import twilio from "twilio";
// import jwtToken from "../helper/jwtToken";
// import logger from "../utils/logger";
// const client = twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);

// const signUp = async (req: Request, res: Response) => {
//   try {
//     const { name, email, phoneNumber } = req.body;
//     if(!name || !email || !phoneNumber){
//       return res.status(404).json({success:false,message:"Enter valid details."})
//     }
//     const userExist = await driverService.findDriver({ phoneNumber });
//     if (userExist) {
//       return res.status(400).json({success:false,message:"User Already exist."})
//     }
//       const response = await driverService.registeruserTemp({
//         name,
//         email: email.toLowerCase(),
//         phoneNumber,
//         role:'driver',
//       });
//       if (!response) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid Data",
//         });
//       }
//       const otpResponse = await sendOtp(phoneNumber);
//       if (!otpResponse.success) {
//         return res.status(400).json({
//           success: false,
//           message: "Failed OTP response"
//         })
//       }
//       await response?.save();
//       return res.status(200).json({
//         success: true,
//         message: "OTP sent Please verify within 10 minutes",
//       });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error,
//     });
//   }
// };

// const sendOtp = async (phoneNumber: string) => {
//   try {
//      await client.verify.v2
//       .services(TWILIO.SERVICE_SID)
//       .verifications.create({
//         to: `+91${phoneNumber}`,
//         channel: "sms",
//       });
//     return {
//       success: true,
//       message: `OTP successfully sent to mobile Number`,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error,
//     };
//   }
// };

// const verifyOtp = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;
//   if (!phoneNumber && !otp) {
//     return res.status(404).json({
//       success: false,
//       message: "Please Enter Phone number and otp",
//     });
//   }
//   try {
//     const response = await client.verify.v2
//       .services(TWILIO.SERVICE_SID)
//       .verificationChecks.create({
//         to: `+91${phoneNumber}`,
//         code: otp,
//       });
//     if (response.status === "approved") {
//       const existUserTemp = await driverService.findPhoneNumber({
//         phoneNumber,
//       });
//       if (existUserTemp) {
//         const newUser = await driverService.registerUser({
//           name: existUserTemp.name,
//           email: existUserTemp.email,
//           phoneNumber: existUserTemp.phoneNumber,
//           role: existUserTemp.role,
//         });
//         await newUser?.save();
//         await driverService.removeTempUser(existUserTemp.id);
//       }
//     }
//     return res.status(201).json({
//       success: true,
//       message: "Successfully Verified and Registered ",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error
//     });
//   }
// };

// const sendLoginOtp = async (req: Request, res: Response) => {
//   const { phoneNumber } = req.body;
//   if(!phoneNumber){
//    return res.status(404).json({success:false,message:"Enter PhoneNumber"})
//   }
//   let lastDigit = phoneNumber?.substring(5,10)
//   let registeredUser = await driverService.findDriver({ phoneNumber });
//   if (!registeredUser) {
//     return res.status(404).json({
//       success: false,
//       message: `No user exist with such ${phoneNumber} please Sign-Up first!!`,
//     });
//   } else {
//     try {
//        await client.verify.v2
//         .services(TWILIO.SERVICE_SID)
//         .verifications.create({
//           to: `+91${phoneNumber}`,
//           channel: "sms",
//         });
//       return res.status(200).json({
//         success: true,
//         message: `OTP successfully sent to mobile Number ending with ${lastDigit}`,
//       });
      
//     } catch (error) {
//       logger.error(error)
//       return res.status(500).json({
//         success: false,
//         message: "Failed to Send OTP, "+ error,
//       });
//     }
//   }
// };

// const login = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;
//   if(!phoneNumber || !otp){
//     return res.status(404).json({
//       success: false,
//       message: "Please Enter valid phone number and otp"
//     })
//   }
//   try {
//     const response = await client.verify.v2
//       .services(TWILIO.SERVICE_SID)
//       .verificationChecks.create({
//         to: `+91${phoneNumber}`,
//         code: otp,
//       });
//     if (response.status === "approved") {
//       const existUser = await driverService.findDriver({ phoneNumber });
//       if (!existUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Oops!! Sign-Up first",
//         });
//       } else {
//         const token = jwtToken(existUser);
//         existUser.token = token;
//         return res
//           .cookie("token", token, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly:true })
//           .status(200).json({
//             success: true,
//             message: "User Logged in successfully",
//           });
//       }
//     }
//   } catch (error) {
//     logger.error(error)
//     return res.status(500).json({
//       success: false,
//       message: error,
//     });
//   }
// };

// export { signUp, verifyOtp, sendLoginOtp, login };


import { Request, Response } from 'express';
import  {driverService}  from '../services/driverService';

const STATIC_PHONE_NUMBER = "9999999999";
const STATIC_OTP = "9999";

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber } = req.body;
  if (!name || !email || !phoneNumber) {
    return res
      .status(404)
      .json({ success: false, message: "Enter valid details." });
  }
  const userExist = await driverService.findDriver({ phoneNumber });
  if (userExist) {
    return res
      .status(200)
      .json({ success: false, message: "User Already exist." });
  }
    const response = await driverService.registeruserTemp({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      role:'driver'
    });
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
      });
    }
    return res.json({
      success: true,
      data: response,
      message: "OTP sent successfully"
    })
  
  } catch (error) {
    return res.json({
      success: false,
      message:"Error at signing up "+ error
    })
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;

  // Check if the provided phone number and OTP match the static values
  if (phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP) {
    // Perform user registration or any other necessary actions here
    return res.status(200).json({
      success: true,
      message: "OTP successfully verified",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Invalid phone number or OTP",
    });
  }
};

const sendLoginOtp = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  // Check if the provided phone number matches the static value
  if (phoneNumber === STATIC_PHONE_NUMBER) {
    // Simulate OTP sent
    return res.status(200).json({
      success: true,
      message: "OTP successfully sent",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid phone number",
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.json({
      success: false,
      message: "Enter Valid details",
    });
  }
  try {
    if(phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP)
    return res.status(200).json({
      success: true,
      message: "successfully logged in",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export { signUp, verifyOtp, sendLoginOtp, login };