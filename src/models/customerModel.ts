import mongoose from "mongoose";

export interface Customer{
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
    token: string;
    resetPasswordExpires: Date;
    location: {
      type: string; 
      coordinates: [number, number];
  };
}

const CustomerSchema = new mongoose.Schema<Customer>(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
        unique: true,
      },
      phoneNumber: {
        type: String,
        unique: true,
      },
      role: {
        type: String,
        enum: ["admin", "driver", "user"],
        default: "user",
      },
      token: {
        type: String,
      },
      resetPasswordExpires: {
        type: Date,
      },
      location: {
        type: { 
          type: String, 
          default: "Point" }, 
        coordinates: {
          type: [Number],
          index: "2dsphere"
        },
    },
    },
    { timestamps: true }
  );
  
  CustomerSchema.index({location: "2dsphere"})

  export default mongoose.model<Customer>("Customer", CustomerSchema);