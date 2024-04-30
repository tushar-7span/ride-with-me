import mongoose, { Document } from "mongoose";

export interface Payment extends Document {
  customer:mongoose.Schema.Types.ObjectId,
  booking:mongoose.Schema.Types.ObjectId,
  amount:number,
  paymentMethod:"card"| "cash" | "wallet",
  status:"pending" | "completed"| "failed",
  transactionId:string,
}

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true 
},
  amount: { 
    type: Number,
    required: true 
},
  Method: {
    type: String,
    enum: ["card", "cash", "wallet"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transactionId: { type: String, unique: true },
},{timestamps:true});

export default mongoose.model<Payment>("Payment", paymentSchema);