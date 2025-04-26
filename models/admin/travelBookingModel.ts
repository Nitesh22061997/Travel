// models/travelBooking.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITravelBooking extends Document {
  passport_number: string;
  passport_validity: Date;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  occupation_details: string;
  date_of_travelling: Date;
  total_price: number;
  number_of_person: number;
  country_selected: string;
  number_of_days: number;
  number_of_child: number;
}

const TravelBookingSchema: Schema = new Schema(
  {
    passport_number: { type: String, required: true },
    passport_validity: { type: Date, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    occupation_details: { type: String, required: true },
    date_of_travelling: { type: Date, required: true },
    total_price: { type: Number, required: true },
    number_of_person: { type: Number, required: true },
    country_selected: { type: String, required: true },
    number_of_days: { type: Number, required: true },
    number_of_child: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITravelBooking>(
  "TravelBooking",
  TravelBookingSchema
);
