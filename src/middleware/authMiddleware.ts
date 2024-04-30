import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "../helper/constants";
import logger from "../utils/logger";

// interface AuthenticatedRequest extends Request {
//   user?: JwtPayload;
// }

declare module "express" {
  interface Request {
    user?: JwtPayload; 
  }
}

const verifyToken = (req: Request, res: Response,next: NextFunction) => {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    const token = (authHeader as string)?.split(" ")[1];
    if (!token) {
      logger.info("NO TOKEN FOUND")
      return res.status(404).json({
        success: false,
        messaage: "No Token Found",
      });
    }
    const decode = jwt.verify(token, JWT.SECRET) as JwtPayload;
      if (!decode.role) {
        logger.info("UNABLE TO DECODE TOKEN")
        return res.status(404).json({
          success: false,
          message: "Unable to Decode Token",
        });
      }
      req.user = decode;
      next();
  } catch (error) {
    logger.error("AN ERROR OCCURED WHILE VERIFYING TOKEN!! ",error)
    return res.status(500).json({
      success: false,
      message: "Error occured at verifying Token",
    });
  }
};

const isDriver = (req: Request ,res: Response,next: NextFunction) => {
  try {
    if (req.user?.role !== "driver") {
      logger.warn("PROTECTED ROUTE FOR DRIVER ONLY")
      return res.status(401).json({
        success: false,
        message: "Protected routes for driver only",
      });
    }
    next();
  } catch (error) {
    logger.error("ERROR OCCURED AT ISDRIVER MIDDLEWARE",error);
    return res.status(500).json({
      success: false,
      data: "Error occured at isDriver",
    });
  }
};

const isAdmin = (req:Request, res: Response,next: NextFunction) => {
  try {
    if (req.user?.role !== "admin") {
      logger.warn("PROTECTED ROUTE FOR ADMIN ONLY")
      return res.status(401).json({
        success: false,
        message: "Protected routes for admin only",
      });
    }
    next();
  } catch (error) {
    logger.error("ERROR OCCURED AT ISADMIN MIDDLEWARE",error);
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured at isAdmin",
    });
  }
};

const isUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== "user") {
      logger.warn("PROTECTED ROUTE FOR USER ONLY")
      return res.status(401).json({
        success: false,
        message: "Protected routes for user only",
      });
    }
    next();
  } catch (error) {
    logger.error("ERROR OCCURED AT ISUSER MIDDLEWARE",error);
    return res.status(500).json({
      success: false,
      data: "Error occured at isUser",
    });
  }
};

export { verifyToken, isUser, isDriver, isAdmin };