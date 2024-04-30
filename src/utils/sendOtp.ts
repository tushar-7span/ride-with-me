import { TWILIO } from "../helper/constants";
import twilio from "twilio";
const client = twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);
import logger from "./logger";

const sendOtp = async (phoneNumber: string) => {
    try {
      const lastDigit = phoneNumber.substring(6, 10);
      await client.verify.v2.services(TWILIO.SERVICE_SID).verifications.create({
        to: `+91${phoneNumber}`,
        channel: "sms",
      });
      logger.info(`OTP sent successfully to mobile number xxxxxx${lastDigit}`)
      return {
        success: true,
        message: `OTP successfully sent to mobile Number ending with`,
      };
    } catch (error) {
      logger.error("Error occured at sending otp function! ", error)
      return {
        success: false,
        message: error,
      };
    }
  };

  export { sendOtp }