import { Request, Response } from "express";
import Visa from "../models/user/visaModel";

// Helper to safely construct the prices object with default values
const constructPrices = (body: any) => {
  return {
    adult: {
      "30_days": Number(body.adult_30_days) || 0,
      "60_days": Number(body.adult_60_days) || 0,
      "90_days": Number(body.adult_90_days) || 0,
      "180_days": Number(body.adult_180_days) || 0,
    },
    children: {
      "30_days": Number(body.children_30_days) || 0,
      "60_days": Number(body.children_60_days) || 0,
      "90_days": Number(body.children_90_days) || 0,
      "180_days": Number(body.children_180_days) || 0,
    },
    common: {
      "14_days": Number(body.common_14_days) || 0,
      "16_days": Number(body.common_16_days) || 0,
    },
  };
};

// Create a new visa entry
export const createVisa = async (req: any, res: any): Promise<void> => {
  try {
    const { country, description, countryVisaPrice } = req.body;
    const image = req.file?.path;

    if (!image) {
      res.status(400).json({ message: "Image upload failed" });
      return;
    }

    const newVisa = new Visa({
      country,
      image,
      description,
      countryVisaPrice,
      prices: constructPrices(req.body),
    });

    await newVisa.save();
    res.status(201).json({ message: "Visa entry created", data: newVisa });
  } catch (error) {
    res.status(500).json({ message: "Error creating visa entry", error });
  }
};

// Get all visa entries
export const getAllVisas = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const visas = await Visa.find();
    res.status(200).json({ message: "All visa entries", visas });
  } catch (error) {
    res.status(500).json({ message: "Error fetching visa data", error });
  }
};

// Get a single visa entry by country
export const getVisaByCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country } = req.params;
    const visa = await Visa.findOne({ country });

    if (!visa) {
      res.status(404).json({ message: "Visa not found" });
      return;
    }

    res.status(200).json(visa);
  } catch (error) {
    res.status(500).json({ message: "Error fetching visa data", error });
  }
};

// Update visa entry
export const updateVisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country } = req.params;
    const { description, countryVisaPrice } = req.body;

    const updateData: any = {
      ...(description && { description }),
      ...(countryVisaPrice && { countryVisaPrice }),
      prices: constructPrices(req.body),
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedVisa = await Visa.findOneAndUpdate({ country }, updateData, {
      new: true,
    });

    if (!updatedVisa) {
      res.status(404).json({ message: "Visa entry not found" });
      return;
    }

    res.status(200).json({ message: "Visa entry updated", data: updatedVisa });
  } catch (error) {
    res.status(500).json({ message: "Error updating visa data", error });
  }
};

// Delete a visa entry
export const deleteVisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country } = req.params;
    const deletedVisa = await Visa.findOneAndDelete({ country });

    if (!deletedVisa) {
      res.status(404).json({ message: "Visa entry not found" });
      return;
    }

    res.status(200).json({ message: "Visa entry deleted", data: deletedVisa });
  } catch (error) {
    res.status(500).json({ message: "Error deleting visa data", error });
  }
};

// Simple test endpoint
export const hi = async (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello from the server!" });
};
