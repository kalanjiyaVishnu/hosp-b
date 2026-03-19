import { z } from "zod";
import { registerSchema, loginSchema, bookingSchema } from "../schemas";

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
export type NotificationType = "BOOKING_CREATED" | "BOOKING_APPROVED" | "BOOKING_REJECTED" | "BOOKING_REMINDER" | "SYSTEM";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  configId: string;
  name: string;
  department: string;
  specialization: string;
  availableDays: string[];
  slotDuration: number;
  consultationFee: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  patientId: string;
  doctorId: string;
  slotDate: Date;
  slotTime: string;
  status: BookingStatus;
  reason: string;
  notes?: string | null;
  approvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  patient?: User;
  doctor?: Doctor;
}

export interface Notification {
  id: string;
  userId: string;
  bookingId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SlotAvailability {
  time: string;
  available: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  pageSize: number;
}

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
