import { Request, Response } from "express";
import prisma from "../config/db";
import { sendBookingConfirmation, sendBookingStatusEmail } from "../services/email.service";

export const createBooking = async (req: any, res: Response) => {
  const { doctorId, slotDate, slotTime, reason, notes } = req.body;
  const patientId = req.user.id;

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const booking = await prisma.booking.create({
      data: {
        patientId,
        doctorId,
        slotDate: new Date(slotDate),
        slotTime,
        reason,
        notes,
        status: "PENDING",
      },
      include: { doctor: true, patient: true },
    });

    await prisma.notification.create({
      data: {
        userId: patientId,
        bookingId: booking.id,
        type: "BOOKING_CREATED",
        title: "Booking Requested",
        message: `Your booking for ${new Date(slotDate).toDateString()} at ${slotTime} is pending approval.`,
      },
    });

    await sendBookingConfirmation(req.user.email, req.user.name, {
      doctorName: doctor.name,
      date: new Date(slotDate).toDateString(),
      time: slotTime,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyBookings = async (req: any, res: Response) => {
  const patientId = req.user.id;
  try {
    const bookings = await prisma.booking.findMany({
      where: { patientId },
      include: { doctor: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCurrentBooking = async (req: any, res: Response) => {
  const patientId = req.user.id;
  try {
    const booking = await prisma.booking.findFirst({
      where: { 
        patientId,
        status: { in: ['PENDING', 'APPROVED'] }
      },
      include: { doctor: true },
      orderBy: { slotDate: 'asc' }
    });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const handleStatusUpdate = async (id: string, status: any, notes?: string) => {
  const booking = await prisma.booking.update({
    where: { id },
    data: { 
      status, 
      notes, 
      approvedAt: status === "APPROVED" ? new Date() : undefined 
    },
    include: { patient: true, doctor: true },
  });

  const type = status === "APPROVED" ? "BOOKING_APPROVED" : (status === "REJECTED" ? "BOOKING_REJECTED" : "SYSTEM");
  const title = `Booking ${status}`;
  const message = `Your booking with ${booking.doctor.name} for ${booking.slotDate.toDateString()} has been ${status.toLowerCase()}.`;

  await prisma.notification.create({
    data: {
      userId: booking.patientId,
      bookingId: booking.id,
      type: type as any,
      title,
      message,
    },
  });

  if (status === "APPROVED" || status === "REJECTED") {
    await sendBookingStatusEmail(booking.patient.email, booking.patient.name, booking, status);
  }

  return booking;
};

export const approveBooking = async (req: Request, res: Response) => {
  try {
    const booking = await handleStatusUpdate(req.params.id, "APPROVED");
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const booking = await handleStatusUpdate(req.params.id, "REJECTED", req.body.reason);
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const completeBooking = async (req: Request, res: Response) => {
  try {
    const booking = await handleStatusUpdate(req.params.id, "COMPLETED");
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const cancelBooking = async (req: any, res: Response) => {
  const { id } = req.params;
  const patientId = req.user.id;
  try {
    const booking = await prisma.booking.findFirst({ where: { id, patientId } });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status !== 'PENDING') return res.status(400).json({ success: false, message: "Can only cancel pending bookings" });

    await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBookings = async (req: any, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { patient: true, doctor: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
