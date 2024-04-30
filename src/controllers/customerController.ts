import { Request, Response } from "express";
import { customerService } from "../services/userService";
import logger from "../utils/logger";

const getCustomer = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      const response = await customerService.viewCustomer();
      if (!response) {
        logger.error("Unable to get list of customers")
        return res.status(404).json({
          success: false,
          message: "Unable to get list of customers",
        });
      } else{
        return res.status(200).json({
          success: true,
          data: response,
        });
      }
    } else {
      const responsse = await customerService.viewCustomerById(req.params.id);
      if (!responsse) {
        logger.error("Invalid ID")
        return res.status(404).json({
          success: false,
          message: "Invalid ID",
        });
      } else {
        return res.status(200).json({
          success: true,
          data: responsse,
        });
      }
    }
  } catch (error) {
    logger.error("Error at GetCustomer ",error)
    return res.status(500).json({
      success: false,
    });
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const response = await customerService.updateCustomer(req.params.id, {
      name,
      email,
      role,
    });
    if (!response) {
      logger.error("Invalid ID while updating Customer")
      return res.status(404).json({
        success: false,
        message: "Invalid ID",
      });
    } else {
      logger.info("Updating Customer was success.")
      return res.status(200).json({
        success: true,
        data: response,
      });
    }
  } catch (error) {
    logger.error("Error Occured while updating Customer ", error)
    return res.status(500).json({
      success: false,
    });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const response = await customerService.deleteCustomer(req.params.id);
    if (!response) {
      logger.error("Invalid ID while deleting customer")
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    logger.info("Deleting a customer based on ID was success")
    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error("Error occured while deleting a custoomer ", error)
    return res.status(500).json({
      success: false,
      message: "ERROR in DeleteCustomer " + error,
    });
  }
};

export { getCustomer, updateCustomer, deleteCustomer };