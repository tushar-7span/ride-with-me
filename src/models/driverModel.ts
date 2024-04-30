import mongoose,{Document} from 'mongoose';

export interface driver extends Document {
  name: string;
  email: string; 
  phoneNumber: string; 
  availability: boolean;
  role: string; 
  token: string; 
  location: {
    type: string; 
    coordinates: [number, number];
};
}

const driverSchema = new mongoose.Schema<driver>({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  role:{
    type: String,
    enum: ["admin", "driver", "user"],
    default: 'driver'
  },
  availability: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
  },
  location: {
    type: { 
      type: String, 
      default: "Point" }, 
    coordinates: {
      type: [Number],
      index: "2dsphere"
    }, //long, lat
},
});

driverSchema.index({location: "2dsphere"})

export default mongoose.model<driver>("driver", driverSchema);