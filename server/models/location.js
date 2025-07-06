import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    city: {
      type: String,
      trim: true,
      required: true
    },
    state: {
      type: String,
      trim: true,
      required: true
    },
    country: {
      type: String,
      trim: true,
      required: true
    }
},{
    timestamps: true
});

export default mongoose.model("Location", locationSchema);
