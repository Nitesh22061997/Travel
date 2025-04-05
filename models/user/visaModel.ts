import mongoose, { Schema, Document } from "mongoose";

interface IVisa extends Document {
  country: string;
  countryVisaPrice: Number;
  image: string;
  description: string;
  prices: {
    adult: { "30_days": number; "60_days": number };
    children: { "30_days": number; "60_days": number };
  };
}

const VisaSchema: Schema = new Schema(
  {
    country: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // Stores Cloudinary image URL
    description: { type: String, required: true },
    countryVisaPrice: { type: Number, required: true },
    prices: {
      adult: {
        "30_days": { type: Number, required: true },
        "60_days": { type: Number, required: true },
      },
      children: {
        "30_days": { type: Number, required: true },
        "60_days": { type: Number, required: true },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVisa>("Visa", VisaSchema);
