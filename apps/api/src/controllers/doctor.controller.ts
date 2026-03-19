import { Request, Response } from "express";
import prisma from "../config/db";
import { generateSlots } from "../services/slot.service";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDoctorSlots = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!date || typeof date !== "string") {
    return res.status(400).json({ success: false, message: "Date is required" });
  }

  try {
    const slots = await generateSlots(id, date);
    res.json({ success: true, data: slots });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
