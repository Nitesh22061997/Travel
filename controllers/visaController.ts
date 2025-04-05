import { Request, Response } from "express";
import Visa from "../models/user/visaModel";

// Create a new visa entry with image upload
export const createVisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      country,
      description,
      countryVisaPrice,
      adult_30_days,
      adult_60_days,
      children_30_days,
      children_60_days,
    } = req.body;

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
      prices: {
        adult: {
          "30_days": Number(adult_30_days),
          "60_days": Number(adult_60_days),
        },
        children: {
          "30_days": Number(children_30_days),
          "60_days": Number(children_60_days),
        },
      },
    });

    await newVisa.save();
    res.status(201).json({ message: "Visa entry created", data: newVisa });
  } catch (error) {
    res.status(500).json({ message: "Error creating visa entry", error });
  }
};

export const hi = async (req: any, res: any) => {
  return res.status(200).json({ message: "Hello from the server!" });
};

// Get all visa entries
export const getAllVisas = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const visas = await Visa.find();
    res.status(200).json(visas);
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

// Update visa entry with new image
export const updateVisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path; // Update Cloudinary image
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
