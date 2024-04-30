import { Request, Response, NextFunction ,} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "../helper/constants";
import logger from "../utils/logger";

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
      return res.status(401).json({
        success: false,
        message: "No Token Found",
      });
    }
    try {
      const decode = jwt.verify(token, JWT.SECRET) as JwtPayload;
      if (!decode.role) {
        return res.status(401).json({
          success: false,
          message: "Unable to Decode Token",
        });
      }
      req.user = decode;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured at verifying Token",
    });
  }
};

const isDriver = (req: Request,res: Response,next: NextFunction) => {
  try {
    if (req.user?.role !== "driver") {
      return res.status(401).json({
        success: false,
        message: "Protected routes for driver only",
      });
    }
    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      data: "Error occured at isDriver",
    });
  }
};

const isAdmin = (req: Request, res:Response,next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message:`Sorry It's Protected for ${req.user.role}`,
      });
    }
    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured"+ error,
    });
  }
};

const isUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "Protected routes for user only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: "Error occured at isUser",
    });
  }
};

export { verifyToken, isUser, isDriver, isAdmin };
