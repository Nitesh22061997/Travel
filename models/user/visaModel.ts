import mongoose, { Schema, Document } from "mongoose";

interface IVisa extends Document {
  country: string;
  countryVisaPrice: number;
  image: string;
  description: string;
  prices: {
    adult: {
      "30_days": number;
      "60_days": number;
      "90_days": number;
      "180_days": number;
    };
    children: {
      "30_days": number;
      "60_days": number;
      "90_days": number;
      "180_days": number;
    };
    common: {
      "14_days": number;
      "16_days": number;
    };
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
        "30_days": { type: Number, default: 0, required: false },
        "60_days": { type: Number, default: 0, required: false },
        "90_days": { type: Number, default: 0, required: false },
        "180_days": { type: Number, default: 0, required: false },
      },
      children: {
        "30_days": { type: Number, default: 0, required: false },
        "60_days": { type: Number, default: 0, required: false },
        "90_days": { type: Number, default: 0, required: false },
        "180_days": { type: Number, default: 0, required: false },
      },
      common: {
        "14_days": { type: Number, default: 0, required: false },
        "16_days": { type: Number, default: 0, required: false },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVisa>("Visa", VisaSchema);
