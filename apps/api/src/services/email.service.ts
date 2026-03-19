import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0D7377;">Welcome to MediCare Hospital!</h1>
      <p>Dear ${name},</p>
      <p>Thank you for registering with us. We are committed to providing you with the best healthcare services.</p>
      <p>Best regards,<br/>MediCare Team</p>
    </div>
  `;
  await transporter.sendMail({
    from: config.smtp.from || "MediCare Hospital <noreply@medicare.com>",
    to: email,
    subject: "Welcome to MediCare Hospital",
    html,
  });
};

export const sendBookingConfirmation = async (email: string, name: string, bookingDetails: any) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0D7377;">Booking Confirmation</h1>
      <p>Dear ${name},</p>
      <p>Your appointment has been requested and is currently <strong>PENDING</strong> approval.</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
        <p><strong>Doctor:</strong> ${bookingDetails.doctorName}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
      </div>
      <p>We will notify you once it's approved.</p>
    </div>
  `;
  await transporter.sendMail({
    from: config.smtp.from || "MediCare Hospital <noreply@medicare.com>",
    to: email,
    subject: "Appointment Requested - MediCare Hospital",
    html,
  });
};

export const sendBookingStatusEmail = async (email: string, name: string, booking: any, status: 'APPROVED' | 'REJECTED') => {
  const isApproved = status === 'APPROVED';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: ${isApproved ? '#0D7377' : '#E8534A'};">Appointment ${status}</h1>
      <p>Dear ${name},</p>
      <p>Your appointment with <strong>${booking.doctor.name}</strong> on <strong>${new Date(booking.slotDate).toDateString()}</strong> at <strong>${booking.slotTime}</strong> has been ${status.toLowerCase()}.</p>
      ${isApproved ? `<p>Please arrive 15 minutes early. Consultation Fee: ₹${booking.doctor.consultationFee}</p>` : `<p>Reason: ${booking.notes || 'N/A'}</p>`}
      <p>Best regards,<br/>MediCare Team</p>
    </div>
  `;
  await transporter.sendMail({
    from: config.smtp.from || "MediCare Hospital <noreply@medicare.com>",
    to: email,
    subject: `Appointment ${status} - MediCare Hospital`,
    html,
  });
};
