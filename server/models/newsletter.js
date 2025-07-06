import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, 
      match: [/.+@.+\..+/, 'Please enter a valid email address']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Newsletter", newsletterSchema);
